document.addEventListener('DOMContentLoaded', () => {

    /*
	0 - пустое место
	1 - палуба корабля
	2 - клетка рядом с кораблём
	3 - обстрелянная клетка
	4 - попадание в палубу
	*/

    const gameFields = document.querySelectorAll('.battlefield');
    const moveDisplay = document.querySelector('.move-display');
    const moveDisplayTitle = document.querySelector('.move-display__title');
    const buttonNewGame = document.createElement('button');
    const shipData = {
        fourdeck: [1, 4],
        tripledeck: [2, 3],
        doubledeck: [3, 2],
        singledeck: [4, 1]
    };

    let leftFieldMatrix = [];
    let rightFieldMatrix = [];
    let fieldSize = 10;
    let player1Move = false;
    let player2Move = false;


    function startGame() {
        generateFields();
        generateFieldMatrix();
        randomFilling(leftFieldMatrix);
        randomFilling(rightFieldMatrix);
        player1Move = true;
    }
    startGame();

    function startNewGame() {

        cleanMatrix();
        cleanField();
        buttonNewGame.remove();
        generateFieldMatrix();
        randomFilling(leftFieldMatrix);
        randomFilling(rightFieldMatrix);
        moveGoToFirstPlayer();
    }

    function cleanMatrix() {
        leftFieldMatrix = [];
        rightFieldMatrix = [];
    }

    function cleanField() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((e) => {
            e.classList.remove('miss');
            e.classList.remove('hit');
        })
    }

    function generateFields() {
        for (let i = 0; i < fieldSize * fieldSize; i++) {
            cell1 = document.createElement('div');
            cell1.classList.add('cell');
            cell1.classList.add('droppable');
            cell1.setAttribute('id',`${i}`);
            cell2 = document.createElement('div');
            cell2.classList.add('cell');
            cell2.classList.add('droppable');
            cell2.setAttribute('id',`${100 + i}`);
            gameFields[0].appendChild(cell1);
            gameFields[1].appendChild(cell2);
        }
    }

    function generateFieldMatrix() {
        leftFieldMatrix = [...Array(fieldSize)].map(() => Array(fieldSize).fill(0));
        rightFieldMatrix = [...Array(fieldSize)].map(() => Array(fieldSize).fill(0));
    }

    function randomFilling(fieldMatrix){
        // 1 - horizontal; 2 - vertical   
        for (let ship in shipData) {
            for (let i = 0; i < shipData[ship][0]; i++) {
                let orientation = Math.random() < 0.5 ? 1 : 2;
                if (orientation === 1) {
                    verticalFilling(fieldMatrix, shipData[ship][1]);
                } else {
                    horizontalFilling(fieldMatrix, shipData[ship][1]);
                }
            }
        }
    }

    function verticalFilling(fieldMatrix, shipSize) {
        let [num1, num2] = generateRandomNumber(fieldSize);
        if (num1 + shipSize > fieldSize) {
            verticalFilling(fieldMatrix, shipSize);
            return;
        }
        if (!verticalShipPositionCheck(fieldMatrix, shipSize, num1, num2)) {
            verticalFilling(fieldMatrix, shipSize);
            return;
        }

        verticalShipFill(fieldMatrix, shipSize, num1, num2);
        verticalBusyCellFilling(fieldMatrix, shipSize, num1, num2);
    }

    function verticalShipPositionCheck(fieldMatrix, shipSize, num1, num2) {
        for (let i = 0; i < shipSize; i++){
            if (fieldMatrix[num1 + i][num2] !== 0) {
                return false;
            }
        }
        return true;
    }

    function verticalShipFill(fieldMatrix, shipSize, num1, num2){
        for (let i = 0; i < shipSize; i++){
            fieldMatrix[num1 + i][num2] = 1;
        }
    }

    function verticalBusyCellFilling(fieldMatrix, shipSize, num1, num2) {

        switch(true) {
            case(num1 === 0 && num2 === 0):
                for (let i = 0; i <= shipSize; i++) {
                    fieldMatrix[num1 + i][num2 + 1] = 2;
                    if (fieldMatrix[num1 + i][num2] !== 1) {
                        fieldMatrix[num1 + i][num2] = 2;
                    }
                }
                break;
            case(num1 === 0 && num2 === (fieldSize - 1)):
                for (let i = 0; i <= shipSize; i++) {
                    fieldMatrix[num1 + i][num2 - 1] = 2;
                    if (fieldMatrix[num1 + i][num2] !== 1) {
                        fieldMatrix[num1 + i][num2] = 2;
                    }
                }
                break;
            case(num1 === 0):
                for (let i = 0; i <= shipSize; i++) {
                    fieldMatrix[num1 + i][num2 - 1] = 2;
                    fieldMatrix[num1 + i][num2 + 1] = 2;
                    if (fieldMatrix[num1 + i][num2] !== 1) {
                        fieldMatrix[num1 + i][num2] = 2;
                    }
                }
                break;
            case((num1 +  shipSize) <= (fieldSize - 1) && num2 === 0):
                for (let i = -1; i <= shipSize; i++) {
                    fieldMatrix[num1 + i][num2 + 1] = 2;
                    if (fieldMatrix[num1 + i][num2] !== 1) {
                        fieldMatrix[num1 + i][num2] = 2;
                    }
                }
                break;
            case((num1 +  shipSize) <= (fieldSize - 1) && num2 === (fieldSize - 1)):
                for (let i = -1; i <= shipSize; i++) {
                    fieldMatrix[num1 + i][num2 - 1] = 2;
                    if (fieldMatrix[num1 + i][num2] !== 1) {
                        fieldMatrix[num1 + i][num2] = 2;
                    }
                }
                break;
            case((num1 +  shipSize) <= (fieldSize - 1)):
                for (let i = -1; i <= shipSize; i++) {
                    fieldMatrix[num1 + i][num2 + 1] = 2;
                    fieldMatrix[num1 + i][num2 - 1] = 2;
                    if (fieldMatrix[num1 + i][num2] !== 1) {
                        fieldMatrix[num1 + i][num2] = 2;
                    }
                }
                break;
            case((num1 +  shipSize) === fieldSize && num2 === 0):
                for (let i = -1; i < shipSize; i++) {
                    fieldMatrix[num1 + i][num2 + 1] = 2;
                    if (fieldMatrix[num1 + i][num2] !== 1) {
                        fieldMatrix[num1 + i][num2] = 2;
                    }
                }
                break;
            case((num1 +  shipSize) === fieldSize && num2 === (fieldSize - 1)):
                for (let i = -1; i < shipSize; i++) {
                    fieldMatrix[num1 + i][num2 - 1] = 2;
                    if (fieldMatrix[num1 + i][num2] !== 1) {
                        fieldMatrix[num1 + i][num2] = 2;
                    }
                }
                break;
            case((num1 +  shipSize) === fieldSize):
                for (let i = -1; i < shipSize; i++) {
                    fieldMatrix[num1 + i][num2 + 1] = 2;
                    fieldMatrix[num1 + i][num2 - 1] = 2;
                    if (fieldMatrix[num1 + i][num2] !== 1) {
                        fieldMatrix[num1 + i][num2] = 2;
                    }
                }
                break;

        }

    }

    

    function horizontalFilling(fieldMatrix, shipSize) {
        let [num1, num2] = generateRandomNumber(fieldSize);
        if (num1 + shipSize > fieldSize) {
            horizontalFilling(fieldMatrix, shipSize);
            return;
        }
        if (!horizontalShipPositionCheck(fieldMatrix, shipSize, num1, num2)) {
            horizontalFilling(fieldMatrix, shipSize);
            return;
        }

        horizontalShipFill(fieldMatrix, shipSize, num1, num2);
        horizontalBusyCellFilling(fieldMatrix, shipSize, num1, num2);  
    }

    function horizontalShipPositionCheck(fieldMatrix, shipSize, num1, num2) {
        for (let i = 0; i < shipSize; i++){
            if (fieldMatrix[num1][num2 + i] !== 0) {
                return false;
            }
        }
        return true;
    }

    function horizontalShipFill(fieldMatrix, shipSize, num1, num2){
        for (let i = 0; i < shipSize; i++){
            fieldMatrix[num1][num2 + i] = 1;
        }
    }

    function horizontalBusyCellFilling(fieldMatrix, shipSize, num1, num2) {

        switch(true) {
            case(num1 === 0 && num2 === 0):
                for (let i = 0; i <= shipSize; i++) {
                    fieldMatrix[num1 + 1][num2 + i] = 2;
                    if (fieldMatrix[num1][num2 + i] !== 1) {
                        fieldMatrix[num1][num2 + i] = 2;
                    }
                }
                break;
            case(num1 === (fieldSize - 1) && num2 === 0):
                for (let i = 0; i <= shipSize; i++) {
                    fieldMatrix[num1 - 1][num2 + i] = 2;
                    if (fieldMatrix[num1][num2 + i] !== 1) {
                        fieldMatrix[num1][num2 + i] = 2;
                    }
                }
                break;
            case(num2 === 0):
                for (let i = 0; i <= shipSize; i++) {
                    fieldMatrix[num1 - 1][num2 + i] = 2;
                    fieldMatrix[num1 + 1][num2 + i] = 2;
                    if (fieldMatrix[num1][num2 + i] !== 1) {
                        fieldMatrix[num1][num2 + i] = 2;
                    }
                }
                break;
            case((num2 +  shipSize) <= (fieldSize - 1) && num1 === 0):
                for (let i = -1; i <= shipSize; i++) {
                    fieldMatrix[num1 + 1][num2 + i] = 2;
                    if (fieldMatrix[num1][num2 + i] !== 1) {
                        fieldMatrix[num1][num2 + i] = 2;
                    }
                }
                break;
            case((num2 +  shipSize) <= (fieldSize - 1) && num1 === (fieldSize - 1)):
                for (let i = -1; i <= shipSize; i++) {
                    fieldMatrix[num1 - 1][num2 + i] = 2;
                    if (fieldMatrix[num1][num2 + i] !== 1) {
                        fieldMatrix[num1][num2 + i] = 2;
                    }
                }
                break;
            case((num2 +  shipSize) <= (fieldSize - 1)):
                for (let i = -1; i <= shipSize; i++) {
                    fieldMatrix[num1 + 1][num2 + i] = 2;
                    fieldMatrix[num1 - 1][num2 + i] = 2;
                    if (fieldMatrix[num1][num2 + i] !== 1) {
                        fieldMatrix[num1][num2 + i] = 2;
                    }
                }
                break;
            case((num2 +  shipSize) === fieldSize && num1 === 0):
                for (let i = -1; i < shipSize; i++) {
                    fieldMatrix[num1 + 1][num2 + i] = 2;
                    if (fieldMatrix[num1][num2 + i] !== 1) {
                        fieldMatrix[num1][num2 + i] = 2;
                    }
                }
                break;
            case((num2 +  shipSize) === fieldSize && num1 === (fieldSize - 1)):
                for (let i = -1; i < shipSize; i++) {
                    fieldMatrix[num1 - 1][num2 + i] = 2;
                    if (fieldMatrix[num1][num2 + i] !== 1) {
                        fieldMatrix[num1][num2 + i] = 2;
                    }
                }
                break;
            case((num2 +  shipSize) === fieldSize):
                for (let i = -1; i < shipSize; i++) {
                    fieldMatrix[num1 + 1][num2 + i] = 2;
                    fieldMatrix[num1 - 1][num2 + i] = 2;
                    if (fieldMatrix[num1][num2 + i] !== 1) {
                        fieldMatrix[num1][num2 + i] = 2;
                    }
                }
                break;
        }

    }


    function generateRandomNumber(max) {
        let num1 = Math.floor(Math.random() * (max - 1));
        let num2 = Math.floor(Math.random() * (max - 1));
        return [num1, num2];
    }

    // let newArr = leftFieldMatrix.flatMap((e) => e);
    // const leftCells = gameFields[0].querySelectorAll('.cell');
    // newArr.forEach((e, i) => {
    //     if (e === 1) {
    //         leftCells[i].style.background = 'green';
    //     } else if (e === 2) {
    //         leftCells[i].style.background = 'yellow';
    //     }
    // })

    


    // // Drag&Drop

    // const draggableElements = document.querySelectorAll(".draggable");
    // const droppableElements = document.querySelectorAll(".droppable");


    


    // draggableElements.forEach(elem => {
    //     elem.addEventListener('mousedown', (event) => {
    //         event.target.style.position = 'absolute';
    //         moveAt(event.target, event);
    //         document.body.appendChild(elem);
    //         elem.style.zIndex = 1000;

    //         function moveAt(element, event) {
    //             if (element.classList.contains('fourdeck')) {
    //                 element.style.left = event.pageX - element.offsetWidth / 8 + 'px';
    //                 element.style.top = event.pageY - element.offsetHeight / 2 + 'px';
    //             } 
    //             else if (element.classList.contains('tripledeck')) {
    //                 element.style.left = event.pageX - element.offsetWidth / 6 + 'px';
    //                 element.style.top = event.pageY - element.offsetHeight / 2 + 'px';
    //             } else if (element.classList.contains('doubledeck')) {
    //                 element.style.left = event.pageX - element.offsetWidth / 4 + 'px';
    //                 element.style.top = event.pageY - element.offsetHeight / 2 + 'px';
    //             } else if (element.classList.contains('singledeck')) {
    //                 element.style.left = event.pageX - element.offsetWidth / 2 + 'px';
    //                 element.style.top = event.pageY - element.offsetHeight / 2 + 'px';
    //             }
                
    //         }

    //         elem.addEventListener('mousemove', event => {
    //             moveAt(event.target, event)
    //         });
            
    //         elem.addEventListener('mouseup', event => {
    //             document.onmousemove = null;
    //             event.target.onmouseup = null;
    //         })
    //     });

    //     elem.ondragstart = function() {
    //       return false;
    //     };
    // });
    
    
    // droppableElements.forEach(elem => {

    //     // elem.addEventListener("dragenter", dragEnter);
    //     // elem.addEventListener("dragover", dragOver);
    //     // elem.addEventListener("dragleave", dragLeave);
    //     // elem.addEventListener("drag", drag);
    //     // elem.addEventListener("drop", drop);
    // });

    // function dragStart(event) {
    //     event.dataTransfer.setData("text", event.target.id);
    //     return false;
    // }

    // function drag(event) {
    //     // moveAt(event.target, event);
    // }

    // //Events fired on the drop target

    // function dragEnter(event) {
    //     if(!event.target.classList.contains("dropped")) {
            
    //     }
    // }

    // function dragOver(event) {
    //     if(!event.target.classList.contains("dropped")) {
    //         event.preventDefault();
    //     }
    // }

    // function dragLeave(event) {
    //     if(!event.target.classList.contains("dropped")) {
            
    //     }
    // }

    // function drop(event) {
    //     event.preventDefault(); // This is in order to prevent the browser default handling of the data
    //     const draggableElementData = event.dataTransfer.getData("text"); // Get the dragged data. This method will return any data that was set to the same type in the setData() method
    //     const droppableElementData = event.target.getAttribute("data-draggable-id");
    //     const isCorrectMatching = draggableElementData === droppableElementData;
    //     if(isCorrectMatching) {
    //         const draggableElement = document.getElementById(draggableElementData);
    //         event.target.classList.add("dropped");
    //         // event.target.style.backgroundColor = draggableElement.style.color; // This approach works only for inline styles. A more general approach would be the following: 
    //         event.target.style.backgroundColor = window.getComputedStyle(draggableElement).color;
    //         draggableElement.classList.add("dragged");
    //         draggableElement.setAttribute("draggable", "false");
    //         event.target.insertAdjacentHTML("afterbegin", `<i class="fas fa-${draggableElementData}"></i>`);
    //     }
    // }
    
    gameFields[0].onclick = (event) => {
        if (event.target.classList.contains('cell') && player2Move === true) {
            const num1 = Math.ceil((event.target.id / 10) - (event.target.id % 10 / 10));
            const num2 = event.target.id % 10;
            checkTheShoot(num1, num2, leftFieldMatrix, event.target);
        }
    }

    gameFields[1].onclick = (event) => {
        if (event.target.classList.contains('cell') && player1Move === true) {
            const num1 = Math.ceil(((event.target.id - 100) / 10) - ((event.target.id - 100) % 10 / 10));
            const num2 = (event.target.id - 100) % 10;
            checkTheShoot(num1, num2, rightFieldMatrix, event.target);
        }
    }

    gameFields[0].addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (event.target.classList.contains('cell') && player2Move === true) {
            const num1 = Math.ceil((event.target.id / 10) - (event.target.id % 10 / 10));
            const num2 = event.target.id % 10;
            if (leftFieldMatrix[num1][num2] === 2) {
                event.target.classList.add('miss');
            }  else {
                checkTheShoot(num1, num2, leftFieldMatrix, event.target);
            }
        }
    })

    gameFields[1].addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (event.target.classList.contains('cell') && player1Move === true) {
            const num1 = Math.ceil(((event.target.id - 100) / 10) - ((event.target.id - 100) % 10 / 10));
            const num2 = (event.target.id - 100) % 10;
            if (rightFieldMatrix[num1][num2] === 2) {
                event.target.classList.add('miss');
            } else {
                checkTheShoot(num1, num2, rightFieldMatrix, event.target);
            }
        }
    })

    function checkTheShoot(num1, num2, fieldMatrix, element) {
        switch(true) {
            case (fieldMatrix[num1][num2] === 0):
                element.classList.add('miss');
                fieldMatrix[num1][num2] = 3;
                if (fieldMatrix === leftFieldMatrix) {
                    moveGoToFirstPlayer();
                } else {
                    moveGoToSecondPlayer();
                }
                break;
            case (fieldMatrix[num1][num2] === 2):
                element.classList.add('miss');
                fieldMatrix[num1][num2] = 3;
                if (fieldMatrix === leftFieldMatrix) {
                    moveGoToFirstPlayer();
                } else {
                    moveGoToSecondPlayer();
                }
                break;
            case (fieldMatrix[num1][num2] === 1):
                element.classList.add('hit');
                fieldMatrix[num1][num2] = 4;
                checkWin(fieldMatrix);
                // checkNeighbours(num1, num2, fieldMatrix);
                //next step
                break;
        }

    }

    function moveGoToFirstPlayer() {
        player2Move = false;
        player1Move = true;
        moveDisplayTitle.innerHTML = 'Ходит игрок 1';
    }

    function moveGoToSecondPlayer() {
        player1Move = false;
        player2Move = true;
        moveDisplayTitle.innerHTML = 'Ходит игрок 2';
    }

    function checkWin(fieldMatrix) {
        const flatField = fieldMatrix.flatMap(e => e);
        if (!flatField.includes(1)) {
            if (fieldMatrix === leftFieldMatrix) {
                moveDisplayTitle.innerHTML = 'Игрок 2 выиграл!';
                player2Move = false;
                moveDisplay.appendChild(buttonNewGame);
                buttonNewGame.classList.add('button');
                buttonNewGame.innerHTML = 'Новая игра';
                buttonNewGame.addEventListener('click', () => {
                    startNewGame();
                });
            } else if (fieldMatrix === rightFieldMatrix) {
                moveDisplayTitle.innerHTML = 'Игрок 1 выиграл!';
                player1Move = false;
                moveDisplay.appendChild(buttonNewGame);
                buttonNewGame.classList.add('button');
                buttonNewGame.innerHTML = 'Новая игра';
                buttonNewGame.addEventListener('click', () => {
                    startNewGame();
                });
            }
        }

    }
    

    // Заполнение клеток покругу потопленного корабля
    function checkNeighbours(num1, num2, fieldMatrix) {
        if (fieldMatrix[num1 + 1][num2] != 1 && fieldMatrix[num1 - 1][num2] != 1) {
            if (fieldMatrix[num1 + 1][num2] != 4 && fieldMatrix[num1 - 1][num2] != 4) {
                fieldMatrix[num1][num2] = 5;
                verticalBusyCellFilling(fieldMatrix, shipSize = 1, num1, num2)
            }

            //next step
        } else if (fieldMatrix[num1 - 1][num2] === 1) {
            //next step
        } else if (fieldMatrix[num1][num2 + 1] === 1) {
            //next step
        } else if (fieldMatrix[num1][num2 - 1] === 1) {
            //next step
        }
    }
})