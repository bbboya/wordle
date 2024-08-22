const 정답 = "APPLE";

let attempts = 0; //시도
let index = 0; //첫번째 인덱스.칸
let timer;

function appStart() {
  const displayGameover = () => {
    const div = document.createElement("div");
    div.innerText = "게임이 종료됐습니다.";
    div.style =
      "display:flex; justify-content:center; align-items:center; position:absolute; top:35vh; left:40vw; background-color:white; width:200px; height:100px;";
    document.body.appendChild(div);
  };

  const gameover = () => {
    window.removeEventListener("keydown", handleKeydown);
    displayGameover();
    clearInterval(timer);
  };

  //6번째 시도가 끝났으니 gameover
  const nextLine = () => {
    if (attempts === 6) return gameover();
    attempts += 1;
    index = 0;
  };

  const handleEnterKey = async () => {
    let 맞은_갯수 = 0;

    //서버에서 정답을 받아오는 코드 await 필수 서버에서 올때까지 기다림.
    const 응답 = await fetch("/answer");
    const 정답 = await 응답.json();

    //각 index에 어떤 글자가 들어왔는지 확인
    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-column[data-index='${attempts}${i}']`
      );
      //해당 index에 입력한_글자가 정답[index]가 맞는지 확인.
      const 입력한_글자 = block.innerText;
      const 정답_글자 = 정답[i];
      //입력=정답에 인덱스값도 같으면 초록색 만들기
      if (입력한_글자 === 정답_글자) {
        맞은_갯수 += 1;
        block.style.background = "#6AAA64";
        //입력한게 정답글자에 포함인데 인덱스값은 다르면 노란색
      } else if (정답.includes(입력한_글자)) block.style.background = "#C9B458";
      //입력과 정답 맞지않음
      else block.style.background = "#787C7E";
      block.style.color = "white";
    }

    if (맞은_갯수 === 5) gameover();
    else nextLine();
  };

  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.board-column[data-index='${attempts}${index - 1}']`
      ); //입력하면 이미 인덱스가 하나 넘어간다 그 전 인덱스를 지워줘야하기 때문에
      //index-1값을 넣어줘야함
      preBlock.innerText = "";
    }
    if (index !== 0) index -= 1;
  };

  const handleKeydown = (event) => {
    const key = event.key.toUpperCase(); //알파벳 대문자 출력
    const keyCode = event.keyCode;
    const thisBlock = document.querySelector(
      `.board-column[data-index='${attempts}${index}']`
    );

    if (event.key === "Backspace") handleBackspace();
    else if (index === 5) {
      //index는 0~4까지니까 5인 순간만 enter가 눌려야함.
      if (event.key === "Enter") handleEnterKey();
      else return; //enter가 아니면 x
    } else if (65 <= keyCode && keyCode <= 90) {
      //keyCode 값으로 알파벳만 받게하는 조건문
      thisBlock.innerText = key;
      index += 1; //첫번째칸->두번째칸 이렇게 늘어나게함. 칸 하나씩 옮기기
    }
  };

  const startTimer = () => {
    const 시작_시간 = new Date();

    function setTime() {
      const 현재_시간 = new Date();
      const 흐른_시간 = new Date(현재_시간 - 시작_시간);
      const 분 = 흐른_시간.getMinutes().toString().padStart(2, "0");
      const 초 = 흐른_시간.getSeconds().toString().padStart(2, "0");
      const timerDiv = document.querySelector("#timer");
      timerDiv.innerText = `${분}:${초}`;
    }
    timer = setInterval(setTime, 1000); //잠시 저장해뒀다가 gameover에서 clear
  };

  startTimer();
  window.addEventListener("keydown", handleKeydown);
}

appStart();
