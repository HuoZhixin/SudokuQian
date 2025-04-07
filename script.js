document.addEventListener('DOMContentLoaded', function () {
    let grid = generateSudoku(); // 生成数独网格
    let historyStack = []; // 操作历史栈

    renderGrid(grid); // 渲染网格

    // 绑定按钮事件
    document.getElementById('check-button').addEventListener('click', function () {
        if (checkSudoku(grid)) {
            alert('🎉 恭喜你，数独完成正确！');
        } else {
            alert('😅 答案有误，请继续努力！');
        }
    });

    document.getElementById('hint-button').addEventListener('click', function () {
        let hint = getHint(grid);
        if (hint) {
            saveToHistory(hint.row, hint.col, grid[hint.row][hint.col], hint.number); // 保存提示操作
            grid[hint.row][hint.col] = hint.number;
            renderGrid(grid);
        } else {
            alert('无法提供提示，请继续尝试！');
        }
    });

    document.getElementById('undo-button').addEventListener('click', function () {
        undoLastMove(grid);
    });

    document.getElementById('reset-button').addEventListener('click', function () {
        grid = generateSudoku();
        historyStack = []; // 清空操作历史
        renderGrid(grid);
    });

    // 渲染数独网格
    function renderGrid(grid) {
        let gridElement = document.getElementById('sudoku-grid');
        gridElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                let cell = document.createElement('div');
                cell.className = grid[i][j] !== 0 ? 'sudoku-cell filled' : 'sudoku-cell';
                cell.textContent = grid[i][j] !== 0 ? grid[i][j] : '';
                if (grid[i][j] === 0) {
                    cell.addEventListener('click', function () {
                        let number = prompt('请输入数字（1-9）：');
                        if (number >= 1 && number <= 9) {
                            let prevValue = grid[i][j]; // 保存旧值
                            grid[i][j] = parseInt(number); // 更新为新值
                            saveToHistory(i, j, prevValue, grid[i][j]); // 保存操作记录
                            renderGrid(grid);
                        }
                    });
                }
                gridElement.appendChild(cell);
            }
        }
    }

    // 保存操作记录
    function saveToHistory(row, col, prevValue, newValue) {
        historyStack.push({ row, col, prevValue, newValue });
    }

    // 撤回上一步操作
    function undoLastMove(grid) {
        if (historyStack.length === 0) {
            alert("没有可撤回的操作！");
            return;
        }
        let lastMove = historyStack.pop();
        grid[lastMove.row][lastMove.col] = lastMove.prevValue;
        renderGrid(grid);
    }

    // 检查数独是否正确
    function checkSudoku(grid) {
        // 检查每行
        for (let i = 0; i < 9; i++) {
            let row = grid[i];
            if (!isValidSet(row)) return false;
        }

        // 检查每列
        for (let j = 0; j < 9; j++) {
            let col = grid.map(row => row[j]);
            if (!isValidSet(col)) return false;
        }

        // 检查每个3x3小方格
        for (let i = 0; i < 9; i += 3) {
            for (let j = 0; j < 9; j += 3) {
                let square = [];
                for (let x = 0; x < 3; x++) {
                    for (let y = 0; y < 3; y++) {
                        square.push(grid[i + x][j + y]);
                    }
                }
                if (!isValidSet(square)) return false;
            }
        }

        return true;
    }

    // 检查一组数字是否有效
    function isValidSet(numbers) {
        let set = new Set(numbers);
        return set.size === 9 && !set.has(0); // 0代表空白格子
    }

    // 获取提示
    function getHint(grid) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (grid[i][j] === 0) {
                    let possibleNumbers = getPossibleNumbers(grid, i, j);
                    if (possibleNumbers.length === 1) {
                        return { row: i, col: j, number: possibleNumbers[0] };
                    }
                }
            }
        }
        return null;
    }

    // 获取某个格子可能的数字
    function getPossibleNumbers(grid, row, col) {
        let usedNumbers = new Set();
        // 检查行
        for (let i = 0; i < 9; i++) {
            usedNumbers.add(grid[row][i]);
        }
        // 检查列
        for (let i = 0; i < 9; i++) {
            usedNumbers.add(grid[i][col]);
        }
        // 检查3x3小方格
        let startRow = Math.floor(row / 3) * 3;
        let startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                usedNumbers.add(grid[startRow + i][startCol + j]);
            }
        }
        // 返回未使用的数字
        let possibleNumbers = [];
        for (let num = 1; num <= 9; num++) {
            if (!usedNumbers.has(num)) {
                possibleNumbers.push(num);
            }
        }
        return possibleNumbers;
    }

    // 生成数独网格
    function generateSudoku() {
        // 这里生成一个简单的数独示例
        return [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ];
    }
});
