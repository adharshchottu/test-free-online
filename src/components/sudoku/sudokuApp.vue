<template>
  <h1 class="text-white bg-black pt-20 md:pt-24 lg:pt-28 block-title text-center">Play Sudoku Online Free</h1>
  <div class="flex flex-col items-center h-[80vh] bg-black">
    <div class="bg-black p-4 rounded-lg shadow-lg">
      <div class="grid grid-cols-9 gap-1 mb-4">
        <template v-for="(row, rowIndex) in board" :key="rowIndex">
          <div v-for="(cell, colIndex) in row" :key="`${rowIndex}-${colIndex}`" :class="[
            'w-10 h-10 lg:w-14 lg:h-14 flex items-center justify-center border text-white lg:text-xl',
            { 'bg-blue-600': selected?.row === rowIndex && selected?.col === colIndex },
            { 'bg-black': !(selected?.row === rowIndex && selected?.col === colIndex) },
            { 'bg-red-600': wrongCells.some(wrongCell => wrongCell.row === rowIndex && wrongCell.col === colIndex) },
            { 'border-r-4 border-r-white': colIndex % 3 === 2 },
            { 'border-b-4 border-b-white': rowIndex % 3 === 2 },
            'cursor-pointer'
          ]" @click="handleCellClick(rowIndex, colIndex)" @keydown="handleKeyDownEvent($event)" tabindex="0">
            {{ cell !== 0 ? cell : '' }}
          </div>
        </template>
      </div>
      <div class="lg:hidden grid grid-cols-3 gap-2">
        <button v-for="num in 9" :key="num" class="bg-blue-500 text-white py-2 px-4 rounded"
          @click="handleNumberInput(num)">
          {{ num }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import confetti from "canvas-confetti";

export default {
  setup() {
    const board = ref(Array(9).fill().map(() => Array(9).fill(0)))
    const fixedBoard = ref([]);
    const selected = ref(null)
    const wrongCells = ref([])

    const isBoardComplete = () => {
      // Check if all cells are filled
      for (let row of board.value) {
        if (row.includes(0)) {
          return false; // At least one cell is empty
        }
      }
      return true;
    };

    const handleBeforeUnload = (event) => {
      if (!isBoardComplete()) {
        event.preventDefault(); // Required in some browsers
        event.returnValue = ""; // Standard way to trigger a confirmation dialog
      }
    };

    onMounted(() => {
      // Add the event listener when the component is mounted
      window.addEventListener("beforeunload", handleBeforeUnload);
    });

    onBeforeUnmount(() => {
      // Clean up the event listener when the component is unmounted
      window.removeEventListener("beforeunload", handleBeforeUnload);
    });


    const initialBoard = [
      [5, 0, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]

    onMounted(() => {
      board.value = initialBoard

      fixedBoard.value = initialBoard.map(row =>
        row.map(cell => cell !== 0)
      );
    })

    const handleCellClick = (row, col) => {
      if (!fixedBoard.value[row][col]) {
        selected.value = { row, col }
      }
    }

    const handleNumberInput = (number) => {
      if (selected.value) {
        const { row, col } = selected.value
        if (!fixedBoard.value[row][col]) {
          board.value[row][col] = number
        }
      }
    }

    const handleKeyDownEvent = (event) => {
      if (event.key >= '1' && event.key <= '9') {
        const { row, col } = selected.value
        if (!fixedBoard.value[row][col]) {
          board.value[row][col] = Number(event.key)
        }
      }
    }

    const isValid = (row, col, num) => {
      // Check row
      for (let x = 0; x < 9; x++) {
        if (x !== col && board.value[row][x] === num) {
          return false;
        }
      }

      // Check column
      for (let x = 0; x < 9; x++) {
        if (x !== row && board.value[x][col] === num) {
          return false;
        }
      }

      // Check 3x3 box
      let boxRow = Math.floor(row / 3) * 3;
      let boxCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const currentRow = boxRow + i;
          const currentCol = boxCol + j;
          if (
            (currentRow !== row || currentCol !== col) &&
            board.value[currentRow][currentCol] === num
          ) {
            return false;
          }
        }
      }

      return true;
    };

    const checkSudoku = () => {
      wrongCells.value = []

      const allFilled = !board.value.flat().includes(0);

      if (!allFilled) {
        // Not all cells are filled.
        return false;
      }

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const num = board.value[row][col]
          if (!isValid(row, col, num)) {
            wrongCells.value.push({ row, col })
          }
        }
      }

      if (wrongCells.value.length > 0) {
        // wrong cells found
        return false
      }

      // sudoku is correct
      confetti({
        particleCount: 250,
        spread: 360,
        origin: { y: 0.02 }
      });
      return true
    }


    watch(board, () => {
      checkSudoku()
    }, { deep: true })


    return {
      board,
      selected,
      wrongCells,
      handleCellClick,
      handleNumberInput,
      handleKeyDownEvent,
      isValid
    }
  }
}
</script>