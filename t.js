const s = async function () {
  setTimeout(() => 1, 2000);
};

const start = async function () {
  const data = s();

  await new Promise((res, rej) => {
    setTimeout(() => {
      data.then((d) => {
        console.log(d);
      });
    }, 1000);
  });
};

start();
