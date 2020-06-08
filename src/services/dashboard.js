import { getExams } from './exam';
import { getApprovedPayments } from './payment';

const months = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "SET",
  "NOV",
  "DEZ",
];

const getMonthsFromCurrent = (qtd = 5) => {
  let currentMonth = new Date().getMonth();
  const months = []
  for(let i = 0; i < qtd; i++) {
    if(currentMonth < 0) {
      currentMonth = 11
    }
    months.push(currentMonth);
    currentMonth = currentMonth - 1;
  }
  return months.reverse();
}

export async function getExamsGraph(user) {
  const exams = await getExams(user);
  const monthsFromCurrent = getMonthsFromCurrent(12);
  const labels = monthsFromCurrent.map(val => months[val]);
  if(!exams.length) {
    return { 
      labels,
      data1: [ 0, 0, 0, 0, 0],
      data2: [ 0, 0, 0, 0, 0],
      data3: [ 0, 0, 0, 0, 0],
      dataFinished: {
        labels: getMonthsFromCurrent(),
        data: [ 0, 0, 0, 0, 0],
        total: 0
      }
    }
  }
  const data1 = monthsFromCurrent.map(month => {
    return exams
      .filter(exam => new Date(exam.date_created).getMonth() === month)
      .length
  })

  const data2 = monthsFromCurrent.map(month => {
    return exams
      .filter(exam => 
        (
          new Date(exam.date_created).getMonth() === month &&
          exam.type === 'CONSULTA'
        )
      )
      .length
  })

  const data3 = monthsFromCurrent.map(month => {
    return exams
      .filter(exam => 
        (
          new Date(exam.date_created).getMonth() === month &&
          exam.type === 'COLETA'
        )
      )
      .length
  })

  const monthsFromCurrentFinished = getMonthsFromCurrent();
  const labelsFinished = monthsFromCurrentFinished.map(val => months[val]);
  const dataFinished = monthsFromCurrentFinished.map(month => {
    return exams
      .filter(exam => 
        (
          new Date(exam.date_created).getMonth() === month &&
          exam.status === 'finished'
        )
      )
      .length
  })

  const dataFinishedTotal = dataFinished.reduce((a, b) => a + b);

  return { labels, data1, data2, data3, dataFinished: { labels: labelsFinished, data: dataFinished, total: dataFinishedTotal } };
}

export async function getClientsGraph(user) {
  const exams = await getExams(user);
  const monthsFromCurrent = getMonthsFromCurrent();
  const labels = monthsFromCurrent.map(val => months[val]);
  if(!exams.length) {
    return { labels, data: [ 0, 0, 0, 0, 0], total: 0 }
  }

  const data = monthsFromCurrent.map(month => {
    const clients = exams
      .filter(exam => new Date(exam.date_created).getMonth() === month)
      .map(exam => exam.client)
    return [...new Set(clients)].length;
  })

  const total = data.reduce((a, b) => a + b);

  return { labels, data, total };
}

export async function getProfitGraph(user) {
  const payments = await getApprovedPayments(user);
  const monthsFromCurrent = getMonthsFromCurrent();
  const labels = monthsFromCurrent.map(val => months[val]);
  if(!payments.length) {
    return { labels, data: [ 0, 0, 0, 0, 0], total: 0 }
  }

  const data = monthsFromCurrent.map(month => {
    const monthPayments =  payments
      .filter(payment => new Date(payment.date_created).getMonth() === month)
      .map(payment => payment.price);

    return monthPayments.length
      ? monthPayments.reduce((a, b) => a + b)
      : 0;
  })
  const total = data.reduce((a, b) => a + b);

  return { labels, data, total }
}
