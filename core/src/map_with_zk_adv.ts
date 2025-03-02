import fs from "fs";

interface Event {
  time: string;
  payoff: number;
}

interface Contract {
  events: Event[];
}

function mapJsonToRiskData(jsonData: Contract[]): { inflow: number[][]; outflow: number[][]; monthsCount: number } {
  if (jsonData.length === 0) return { inflow: [], outflow: [], monthsCount: 0 };

  const allDates = jsonData.flatMap(contract => contract.events.map(event => new Date(event.time)));
  const minDate = new Date(Math.min(...allDates.map(date => date.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(date => date.getTime())));

  const monthsCount = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth()) + 1;
  
  const inflow: number[][] = Array.from({ length: monthsCount }, () => [0]);
  const outflow: number[][] = Array.from({ length: monthsCount }, () => [0]);

  jsonData.forEach((contract: Contract) => {
    contract.events.forEach((event: Event) => {
      const date = new Date(event.time);
      const monthIndex = (date.getFullYear() - minDate.getFullYear()) * 12 + (date.getMonth() - minDate.getMonth());
      if (event.payoff > 0) {
        inflow[monthIndex].push(event.payoff);
      } else if (event.payoff < 0) {
        outflow[monthIndex].push(Math.abs(event.payoff));
      }
    });
  });

  return { inflow, outflow, monthsCount };
}

function loadAndProcessJsonData(jsonData: string): { inflow: number[][]; outflow: number[][]; monthsCount: number } {
  // Parse raw JSON data into Contract[]
  const parsedData: Contract[] = JSON.parse(jsonData);
  
  // Call the existing function
  return mapJsonToRiskData(parsedData);
}



export { mapJsonToRiskData, loadAndProcessJsonData };
