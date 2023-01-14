// get data from db
const getAllDataDB = async () => {
  const result = await fetch('/db/date.json');

  const data = await result.json();

  return data;
};

// get tours array on some date
const getToursDate = async (date) => {
  const result = await fetch('/db/date.json');

  const data = await result.json();

  return [data.find(obj => obj.date === date)];
};

// get tours array for a number of people
const getToursAmountPeople = async (amountPeople) => {
  const result = await fetch('/db/date.json');

  const data = await result.json();

  return data.reduce((prev, curr) => {
    if (amountPeople >= curr['min-people'] &&
        amountPeople <= curr['max-people']) {
      return [...prev, curr];
    } else return [...prev];
  }, []);
};

export {
  getAllDataDB,
  getToursDate,
  getToursAmountPeople,
};
