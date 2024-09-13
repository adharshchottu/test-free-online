<script>
  export let isOpen = false;

  function toggleModal() {
    isOpen = !isOpen;
  }
</script>

{#if isOpen}
  <div class="modal-overlay" on:click={toggleModal} on:keypress={toggleModal} />
  <div class="modal">
    <button class="modal-close" on:click={toggleModal}>×</button>
    <slot />
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    z-index: 20;
    width: 80%;
    max-width: 400px;
  }

  .modal-close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    cursor: pointer;
  }
</style>
