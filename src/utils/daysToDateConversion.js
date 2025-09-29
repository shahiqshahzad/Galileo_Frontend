import moment from "moment";

export const calculateFutureDate = (numberOfDays) => {
  const currentDate = moment();
  const futureDate = currentDate.add(numberOfDays, "days");
  return futureDate.format("MMMM Do YYYY");
};
