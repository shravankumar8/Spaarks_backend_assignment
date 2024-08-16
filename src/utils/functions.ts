export const  objectFormatter=(results: any)=>{
  let processedRecords: any[] = [];
  results.map((item: any) => {
    let gradeScore: any[] = [];

    item.grades.map((item: any) => {
      gradeScore.push(item.score);
    });
    let obj = {
      name: item.name,
      address: item.address,
      borough: item.borough,
      cuisine: item.cuisine,
      highestRating: Math.max(...gradeScore),
      lowestRating: Math.min(...gradeScore),
      totalRating: gradeScore.length,
      averageRating: gradeScore.reduce((a, b) => a + b, 0) / gradeScore.length,
    };
    processedRecords.push(obj);
  });
  return processedRecords;
}