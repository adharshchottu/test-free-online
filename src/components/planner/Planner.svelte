<script>
	import { onMount } from 'svelte';

	let timeLeft = 1500; // 25 minutes in seconds
	let isRunning = false;
	let isBreak = false;
	let tasks = [];
	let newTask = '';
	let timerInterval;

	// Load from localStorage
	onMount(() => {
		const saved = localStorage.getItem('planner-tasks');
		if (saved) {
			tasks = JSON.parse(saved);
		}
	});

	// Save to localStorage whenever tasks change
	$: if (typeof window !== 'undefined') {
		localStorage.setItem('planner-tasks', JSON.stringify(tasks));
	}

	// Timer logic
	const toggleTimer = () => {
		if (isRunning) {
			clearInterval(timerInterval);
			isRunning = false;
		} else {
			isRunning = true;
			timerInterval = setInterval(() => {
				if (timeLeft > 0) {
					timeLeft--;
				} else {
					// Switch between work and break
					isBreak = !isBreak;
					timeLeft = isBreak ? 300 : 1500; // 5 min break or 25 min work
				}
			}, 1000);
		}
	};

	const resetTimer = () => {
		isRunning = false;
		isBreak = false;
		timeLeft = 1500;
		clearInterval(timerInterval);
	};

	const skipSession = () => {
		isBreak = !isBreak;
		timeLeft = isBreak ? 300 : 1500;
	};

	// Format time
	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	// Task management
	const addTask = () => {
		if (newTask.trim()) {
			tasks = [
				...tasks,
				{
					id: Date.now(),
					text: newTask,
					status: 'todo' // todo, doing, done
				}
			];
			newTask = '';
		}
	};

	const moveTask = (id, newStatus) => {
		tasks = tasks.map((task) =>
			task.id === id ? { ...task, status: newStatus } : task
		);
	};

	const deleteTask = (id) => {
		tasks = tasks.filter((task) => task.id !== id);
	};

	const getTasks = (status) => tasks.filter((task) => task.status === status);

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			addTask();
		}
	};

	onMount(() => {
		return () => clearInterval(timerInterval);
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-bgDark1 to-bgDark2 p-4 md:p-8 pt-24 md:pt-16 lg:pt-28">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-4xl md:text-5xl font-bold text-white mb-2">Pomodoro Planner</h1>
			<p class="text-secondaryText">25 min focus • 5 min break • Stay productive</p>
		</div>

		<!-- Timer Section -->
		<div class="bg-bgDark2 rounded-2xl p-6 md:p-8 mb-8 border border-mainBorder shadow-lg">
			<div class="text-center">
				<!-- Status Badge -->
				<div class="mb-4 inline-block">
					<span
						class={`px-4 py-1 rounded-full text-sm font-semibold ${
							isBreak
								? 'bg-green-900 text-green-200'
								: 'bg-blue-900 text-blue-200'
						}`}
					>
						{isBreak ? '☕ Break Time' : '⚡ Focus Time'}
					</span>
				</div>

				<!-- Timer Display -->
				<div class="mb-6">
					<div
						class="text-8xl md:text-9xl font-bold text-white font-mono tracking-tight"
						style="letter-spacing: -0.05em;"
					>
						{formatTime(timeLeft)}
					</div>
				</div>

				<!-- Controls -->
				<div class="flex gap-3 justify-center flex-wrap">
					<button
						on:click={toggleTimer}
						class={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
							isRunning
								? 'bg-red-600 hover:bg-red-700 text-white'
								: 'bg-blue-600 hover:bg-blue-700 text-white'
						}`}
					>
						{isRunning ? 'Pause' : 'Start'}
					</button>

					<button
						on:click={resetTimer}
						class="px-6 py-3 rounded-lg font-semibold bg-gray-700 hover:bg-gray-800 text-white transition-all duration-200"
					>
						Reset
					</button>

					<button
						on:click={skipSession}
						class="px-6 py-3 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200"
					>
						Skip
					</button>
				</div>
			</div>
		</div>

		<!-- Task Input -->
		<div class="bg-bgDark2 rounded-2xl p-6 mb-8 border border-mainBorder shadow-lg">
			<label class="block text-white font-semibold mb-3">Add Task</label>
			<div class="flex gap-2">
				<input
					type="text"
					bind:value={newTask}
					on:keydown={handleKeyDown}
					placeholder="What will you focus on?"
					class="flex-1 bg-bgDark3 text-white placeholder-secondaryText rounded-lg px-4 py-3 outline-none border border-mainBorder focus:border-primaryColor transition-colors"
				/>
				<button
					on:click={addTask}
					class="bg-primaryColor hover:bg-secondaryColor text-white px-6 py-3 rounded-lg font-semibold transition-colors"
				>
					Add
				</button>
			</div>
		</div>

		<!-- Kanban Board -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
			<!-- To-Do Column -->
			<div class="bg-bgDark2 rounded-2xl p-4 md:p-6 border border-mainBorder shadow-lg min-h-96 md:min-h-[500px]">
				<div class="flex items-center gap-2 mb-4">
					<div class="w-3 h-3 rounded-full bg-gray-500"></div>
					<h2 class="text-white font-bold text-lg">To-Do ({getTasks('todo').length})</h2>
				</div>
				<div class="space-y-2">
					{#each getTasks('todo') as task (task.id)}
						<div class="bg-bgDark3 rounded-lg p-4 border-l-4 border-gray-500 group hover:border-gray-400 transition-colors">
							<p class="text-white text-sm mb-3 break-words">{task.text}</p>
							<div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									on:click={() => moveTask(task.id, 'doing')}
									class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
								>
									Start
								</button>
								<button
									on:click={() => deleteTask(task.id)}
									class="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors"
								>
									Delete
								</button>
							</div>
						</div>
					{/each}
					{#if getTasks('todo').length === 0}
						<div class="text-secondaryText text-sm text-center py-12">No tasks yet</div>
					{/if}
				</div>
			</div>

			<!-- Doing Column -->
			<div class="bg-bgDark2 rounded-2xl p-4 md:p-6 border border-mainBorder shadow-lg min-h-96 md:min-h-[500px]">
				<div class="flex items-center gap-2 mb-4">
					<div class="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
					<h2 class="text-white font-bold text-lg">Doing ({getTasks('doing').length})</h2>
				</div>
				<div class="space-y-2">
					{#each getTasks('doing') as task (task.id)}
						<div class="bg-bgDark3 rounded-lg p-4 border-l-4 border-blue-500 group hover:border-blue-400 transition-colors">
							<p class="text-white text-sm mb-3 break-words">{task.text}</p>
							<div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									on:click={() => moveTask(task.id, 'done')}
									class="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors"
								>
									Done
								</button>
								<button
									on:click={() => moveTask(task.id, 'todo')}
									class="text-xs bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded transition-colors"
								>
									Back
								</button>
								<button
									on:click={() => deleteTask(task.id)}
									class="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors"
								>
									Delete
								</button>
							</div>
						</div>
					{/each}
					{#if getTasks('doing').length === 0}
						<div class="text-secondaryText text-sm text-center py-12">Start a task</div>
					{/if}
				</div>
			</div>

			<!-- Done Column -->
			<div class="bg-bgDark2 rounded-2xl p-4 md:p-6 border border-mainBorder shadow-lg min-h-96 md:min-h-[500px]">
				<div class="flex items-center gap-2 mb-4">
					<div class="w-3 h-3 rounded-full bg-green-500"></div>
					<h2 class="text-white font-bold text-lg">Done ({getTasks('done').length})</h2>
				</div>
				<div class="space-y-2">
					{#each getTasks('done') as task (task.id)}
						<div class="bg-bgDark3 rounded-lg p-4 border-l-4 border-green-500 group hover:border-green-400 transition-colors">
							<p class="text-white text-sm mb-3 line-through text-gray-400 break-words">{task.text}</p>
							<div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<button
									on:click={() => moveTask(task.id, 'doing')}
									class="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors"
								>
									Redo
								</button>
								<button
									on:click={() => deleteTask(task.id)}
									class="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors"
								>
									Delete
								</button>
							</div>
						</div>
					{/each}
					{#if getTasks('done').length === 0}
						<div class="text-secondaryText text-sm text-center py-12">Complete a task</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Optional: Smooth animations */
	:global {
		@keyframes pulse-ring {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
	}
</style>
