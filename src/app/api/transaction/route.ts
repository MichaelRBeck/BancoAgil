import { NextRequest, NextResponse } from "next/server";
import Transaction from "../../models/Transactions";
import User from "../../models/User";
import connectMongoDB from "../../lib/mongodb";

// Handler para requisição GET: busca transações do usuário pelo userId
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  // Validação do parâmetro obrigatório userId
  if (!userId) {
    return NextResponse.json({ error: "Parâmetro 'userId' ausente." }, { status: 400 });
  }

  try {
    await connectMongoDB();

    // Busca o usuário no banco pelo id
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    const cpfUsuario = user.cpf;

    // Transações feitas pelo usuário (qualquer tipo)
    const feitasPeloUsuario = await Transaction.find({ userId });

    // Transferências recebidas pelo usuário (filtrando tipo e cpfDest)
    const recebidasPeloUsuario = await Transaction.find({
      type: "Transferência",
      cpfDest: cpfUsuario,
    });

    // Função auxiliar para buscar nome completo pelo CPF
    async function getNameByCpf(cpf?: string) {
      if (!cpf) return null;
      const user = await User.findOne({ cpf });
      return user?.fullName || null;
    }

    // Adiciona nomes de origem e destino nas transações feitas
    const feitasComNomes = await Promise.all(
      feitasPeloUsuario.map(async (tx) => {
        const obj = tx.toObject();
        obj.nameOrigin = await getNameByCpf(obj.cpfOrigin);
        obj.nameDest = await getNameByCpf(obj.cpfDest);
        return obj;
      })
    );

    // Adiciona nomes e flag isReceived nas transferências recebidas
    const recebidasFormatadas = await Promise.all(
      recebidasPeloUsuario.map(async (tx) => {
        const obj = tx.toObject();
        obj.nameOrigin = await getNameByCpf(obj.cpfOrigin);
        obj.nameDest = await getNameByCpf(obj.cpfDest);
        obj.isReceived = true;
        return obj;
      })
    );

    // Junta as duas listas e ordena por data decrescente
    const todasTransacoes = [...feitasComNomes, ...recebidasFormatadas];
    todasTransacoes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(todasTransacoes);

  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return NextResponse.json({ error: 'Erro ao buscar transações.' }, { status: 500 });
  }
}

// Handler para requisição PATCH: atualiza valor de uma transação existente
export async function PATCH(req: Request) {
  try {
    await connectMongoDB();

    // Recebe id da transação e novo valor
    const { id, value } = await req.json();

    // Valida se os dados foram fornecidos
    if (!id || value == null) {
      return NextResponse.json({ message: "ID e novo valor são obrigatórios." }, { status: 400 });
    }

    // Busca a transação no banco
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return NextResponse.json({ message: "Transação não encontrada." }, { status: 404 });
    }

    // Calcula a diferença entre o valor novo e o antigo
    const oldValue = Number(transaction.value);
    const newValue = Number(value);
    const diff = newValue - oldValue;

    // Atualiza o saldo do(s) usuário(s) conforme o tipo de transação
    switch (transaction.type) {
      case "Depósito": {
        const user = await User.findOne({ cpf: transaction.cpfDest });
        if (!user) {
          return NextResponse.json({ message: "Usuário não encontrado." }, { status: 404 });
        }
        user.totalBalance += diff;
        await user.save();
        break;
      }

      case "Saque": {
        const user = await User.findOne({ cpf: transaction.cpfOrigin });
        if (!user) {
          return NextResponse.json({ message: "Usuário não encontrado." }, { status: 404 });
        }
        user.totalBalance -= diff;
        await user.save();
        break;
      }

      case "Transferência": {
        const userOrigin = await User.findOne({ cpf: transaction.cpfOrigin });
        const userDest = await User.findOne({ cpf: transaction.cpfDest });

        if (!userOrigin || !userDest) {
          return NextResponse.json({ message: "Usuário(s) não encontrado(s)." }, { status: 404 });
        }

        userOrigin.totalBalance -= diff;
        userDest.totalBalance += diff;

        await userOrigin.save();
        await userDest.save();
        break;
      }

      default:
        return NextResponse.json({ message: "Tipo de transação inválido." }, { status: 400 });
    }

    // Atualiza o valor da transação e salva
    transaction.value = newValue;
    await transaction.save();

    return NextResponse.json({ message: "Transação atualizada com sucesso." }, { status: 200 });

  } catch (error) {
    console.error("Erro ao atualizar transação:", error);
    return NextResponse.json({ message: "Erro ao atualizar transação." }, { status: 500 });
  }
}

// Handler para requisição POST: cria nova transação
export async function POST(req: Request) {
  try {
    await connectMongoDB();

    // Recebe dados da nova transação
    const { userId, tipo, valor, cpfDestinatario } = await req.json();

    // Validação dos dados obrigatórios
    if (!userId || !tipo || !valor) {
      return NextResponse.json({ message: 'Dados incompletos.' }, { status: 400 });
    }

    // Busca o usuário originador
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
    }

    // Monta objeto de dados da transação
    let transactionData: any = {
      userId,
      type: tipo,
      value: parseFloat(valor),
      createdAt: new Date(),
    };

    // Lógica para cada tipo de transação
    if (tipo === "Depósito") {
      user.totalBalance += parseFloat(valor);
      transactionData.cpfDest = user.cpf;

    } else if (tipo === "Saque") {
      if (user.totalBalance < parseFloat(valor)) {
        return NextResponse.json({ message: "Saldo insuficiente." }, { status: 400 });
      }
      user.totalBalance -= parseFloat(valor);
      transactionData.cpfOrigin = user.cpf;

    } else if (tipo === "Transferência") {
      const destUser = await User.findOne({ cpf: cpfDestinatario });
      if (!destUser) {
        return NextResponse.json({ message: "Destinatário não encontrado." }, { status: 404 });
      }
      if (user.totalBalance < parseFloat(valor)) {
        return NextResponse.json({ message: "Saldo insuficiente para transferência." }, { status: 400 });
      }

      user.totalBalance -= parseFloat(valor);
      destUser.totalBalance += parseFloat(valor);

      await destUser.save();

      transactionData.cpfOrigin = user.cpf;
      transactionData.cpfDest = destUser.cpf;

    } else {
      return NextResponse.json({ message: "Tipo de transação inválido." }, { status: 400 });
    }

    // Cria e salva a transação, além de salvar o usuário atualizado
    const transaction = new Transaction(transactionData);
    await transaction.save();
    await user.save();

    return NextResponse.json({ message: "Transação realizada com sucesso." }, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return NextResponse.json({ message: "Erro interno ao criar transação." }, { status: 500 });
  }
}
