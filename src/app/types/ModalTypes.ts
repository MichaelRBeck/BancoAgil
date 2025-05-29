// Tipagens reutilizáveis para o modal e os dados do formulário

export interface FormDataRegister {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    cpf: string;
    birthDate: string;
    acceptedTerms: boolean;
}

export interface FormDataLogin {
    cpf: string;
    password: string;
}

export interface ModalProps {
    onClose: () => void;
    userId?: string | null;
}
