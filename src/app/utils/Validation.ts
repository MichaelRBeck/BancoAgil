import { FormDataRegister } from '../types/ModalTypes';

export const isValidCPF = (cpf: string): boolean => {
  const onlyNumbers = cpf.replace(/\D/g, '');
  if (onlyNumbers.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(onlyNumbers)) return false;
  return true;
};

export const isValidEmail = (email: string): boolean => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const isFormValid = (data: FormDataRegister): boolean => {
  return (
    data.fullName.trim() !== '' &&
    isValidEmail(data.email) &&
    data.password.length >= 6 &&
    data.confirmPassword === data.password &&
    isValidCPF(data.cpf) &&
    data.acceptedTerms
  );
};

export const getFieldErrors = (data: FormDataRegister) => ({
  fullName: data.fullName.trim() === '',
  email: data.email !== '' && !isValidEmail(data.email),
  password: data.password !== '' && data.password.length < 6,
  confirmPassword: data.confirmPassword !== '' && data.confirmPassword !== data.password,
  cpf: data.cpf !== '' && !isValidCPF(data.cpf),
  acceptedTerms: !data.acceptedTerms,
});
