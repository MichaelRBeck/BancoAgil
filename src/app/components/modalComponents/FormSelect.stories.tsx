import React from 'react';
import FormSelect from './FormSelect';

export default {
  title: 'Components/FormSelect',
  component: FormSelect,
};

export const Default = () => (
  <FormSelect
    label="Escolha uma opção"
    name="exampleSelect"
    value="opcao1"
    onChange={() => {}}
    options={[
      { value: 'opcao1', label: 'Opção 1' },
      { value: 'opcao2', label: 'Opção 2' },
      { value: 'opcao3', label: 'Opção 3' },
    ]}
  />
);
