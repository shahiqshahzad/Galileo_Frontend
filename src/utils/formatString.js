// export const formatString = (str, type) => {
//   let string = str;
//   if (type && type === 'date') {
//     string = moment(new Date(str)).format('L');
//   }
//   const words = string.split(' ');
//   const lines = [];
//   let line = '';

//   for (const word of words) {
//     if (line.length + word.length <= 12) {
//       line += word + ' ';
//     } else {
//       lines.push(line.trim());
//       line = word + ' ';
//       if (lines.length === 2) {
//         lines[1] += '...';
//         break;
//       }
//     }
//   }

//   if (line.length > 0 && lines.length < 2) {
//     lines.push(line.trim());
//   }
//   return lines;
// };

export const formatString = (str, type) => {
  const words = str.split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    if (line.length + word.length <= 18) {
      line += word + " ";
    } else {
      lines.push(line.trim());
      line = word + " ";
      if (lines.length === 2) {
        lines[1] += "...";
        break;
      }
    }
  }

  if (line.length > 0 && lines.length < 2) {
    lines.push(line.trim());
  }

  return lines;
};
