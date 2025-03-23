<script lang="ts">
  import { onMount } from "svelte";

  // Default values
  let totalQuestions: number = 100;
  let totalMarks: number = 200;
  let negativeMarkOption: string = "1/3";
  let wrongAnswers: number = 0;
  let totalAttempted: number = 0;
  let score: number = 0;

  // Negative marking options
  const negativeMarkOptions: string[] = ["1/2", "1/3", "1/4", "2/3"];

  // Calculate marks per question
  $: marksPerQuestion = totalQuestions > 0 ? totalMarks / totalQuestions : 0;

  // Calculate correct answers
  $: correctAnswers = Math.max(0, totalAttempted - wrongAnswers);

  // Calculate negative marks value
  $: negativeValue = calculateNegativeValue(negativeMarkOption);

  // Calculate total negative marks
  $: totalNegativeMarks = wrongAnswers * marksPerQuestion * negativeValue;

  // Calculate final score with reactive dependencies
  $: {
    // Ensure data validation
    validateInputs();

    // Calculate score
    score = correctAnswers * marksPerQuestion - totalNegativeMarks;

    // Prevent negative score
    if (score < 0) score = 0;
  }

  // Function to validate inputs
  function validateInputs(): void {
    // Ensure total questions is at least 1
    if (totalQuestions < 1) totalQuestions = 1;

    // Ensure total marks is at least 1
    if (totalMarks < 1) totalMarks = 1;

    // Ensure totalAttempted is not greater than totalQuestions
    if (totalAttempted > totalQuestions) {
      totalAttempted = totalQuestions;
    }

    // Ensure wrongAnswers is not greater than totalAttempted
    if (wrongAnswers > totalAttempted) {
      wrongAnswers = totalAttempted;
    }
  }

  // Function to calculate negative value from the option
  function calculateNegativeValue(option: string): number {
    const [numerator, denominator] = option.split("/").map(Number);
    return numerator / denominator;
  }

  // Function to handle user input for number fields
  function handleNumberInput(
    event: Event,
    min: number,
    max: number | null = null
  ): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value);

    if (isNaN(value)) {
      value = 0;
    } else if (value < min) {
      value = min;
    } else if (max !== null && value > max) {
      value = max;
    }

    input.value = value.toString();
  }

  // Reset function to clear inputs and return to defaults
  function resetCalculator(): void {
    totalQuestions = 100;
    totalMarks = 200;
    negativeMarkOption = "1/3";
    wrongAnswers = 0;
    totalAttempted = 0;
  }

  // Format a number to show up to 2 decimal places, but only if needed
  function formatNumber(num: number): string {
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
  }
</script>

<div class="max-w-5xl mx-auto pt-16 md:pt-16 lg:pt-24">
  <div class="bg-bgDark3 shadow-md rounded px-6 pt-6 pb-8 mb-4">
    <h1 class="text-2xl mb-8 text-center text-white">
      Prelims Marks Calculator
    </h1>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Form Section (Left column on desktop) -->
      <div class="w-full lg:w-1/2">
        <div class="mb-4">
          <label
            class="block text-white text-sm font-bold mb-2"
            for="totalQuestions"
          >
            Total Questions:
          </label>
          <input
            id="totalQuestions"
            type="number"
            bind:value={totalQuestions}
            min="1"
            on:input={(e) => handleNumberInput(e, 1)}
            class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-800"
          />
        </div>

        <div class="mb-4">
          <label class="block text-white text-sm font-bold mb-2" for="totalMarks">
            Total Marks:
          </label>
          <input
            id="totalMarks"
            type="number"
            bind:value={totalMarks}
            min="1"
            on:input={(e) => handleNumberInput(e, 1)}
            class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-800"
          />
        </div>

        <div class="mb-4">
          <label
            class="block text-white text-sm font-bold mb-2"
            for="negativeMarks"
          >
            Negative Marks:
          </label>
          <select
            id="negativeMarks"
            bind:value={negativeMarkOption}
            class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-800"
          >
            {#each negativeMarkOptions as option}
              <option value={option}>{option}</option>
            {/each}
          </select>
        </div>

        <div class="mb-4">
          <label
            class="block text-white text-sm font-bold mb-2"
            for="totalAttempted"
          >
            Total Questions Attempted:
          </label>
          <input
            id="totalAttempted"
            type="number"
            bind:value={totalAttempted}
            min="0"
            max={totalQuestions}
            on:input={(e) => handleNumberInput(e, 0, totalQuestions)}
            class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-800"
          />
        </div>

        <div class="mb-6">
          <label class="block text-white text-sm font-bold mb-2" for="wrongAnswers">
            Wrong Answers:
          </label>
          <input
            id="wrongAnswers"
            type="number"
            bind:value={wrongAnswers}
            min="0"
            max={totalAttempted}
            on:input={(e) => handleNumberInput(e, 0, totalAttempted)}
            class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-800"
          />
        </div>

        <div class="flex justify-center mb-6 lg:mb-0">
          <button
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            on:click={resetCalculator}
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Results Section (Right column on desktop) -->
      <div class="w-full lg:w-1/2 bg-bgDark4 rounded-lg p-5">
        <h2 class="text-xl text-center text-white mb-4">Results</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
          <div class="bg-bgDark5 p-3 rounded-md">
            <p class="text-sm font-bold">Marks per Question</p>
            <p class="text-lg">{formatNumber(marksPerQuestion)}</p>
          </div>

          <div class="bg-bgDark5 p-3 rounded-md">
            <p class="text-sm font-bold">Correct Answers</p>
            <p class="text-lg">{correctAnswers}</p>
          </div>

          <div class="bg-bgDark5 p-3 rounded-md">
            <p class="text-sm font-bold">Negative Marking</p>
            <p class="text-lg">
              {negativeMarkOption} of {formatNumber(marksPerQuestion)}
            </p>
          </div>

          <div class="bg-bgDark5 p-3 rounded-md">
            <p class="text-sm font-bold">Total Negative Marks</p>
            <p class="text-lg">{formatNumber(totalNegativeMarks)}</p>
          </div>
        </div>

        <div
          class="mt-6 p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-center"
        >
          <h3 class="text-white text-lg font-bold mb-2">Your Final Score</h3>
          <p class="text-white text-3xl font-bold">
            {formatNumber(score)} / {totalMarks}
          </p>
          <p class="text-white text-md mt-2">
            ({formatNumber((score / totalMarks) * 100)}%)
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .bg-bgDark3 {
    background-color: #1e293b;
  }

  .bg-bgDark4 {
    background-color: #1a2234;
  }

  .bg-bgDark5 {
    background-color: #273450;
  }

  input,
  select,
  button {
    transition: all 0.3s ease;
  }

  input:focus,
  select:focus,
  button:focus {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
    outline: none;
  }
</style>
