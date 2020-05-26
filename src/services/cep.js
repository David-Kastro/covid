import axios from 'axios';

export default async function getCepInfo(cep) {
  try {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
    return data.erro
      ? {...data, message: 'CEP não encontrado!'}
      : data;
  } catch (err) {
    return {erro: true, message: 'Não foi possível buscar o CEP'};
  }
}