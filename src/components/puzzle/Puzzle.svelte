<script lang="ts">
    import Modal from "./Modal.svelte";

    let customImageUrl;
    let movesSoFar = 0;
    let completed = false;
    const tiles = Array.from({ length: 9 }).map((d, i) => `square${i + 1}`);
    const gridInfo = new Map([
        ["square1", { column: "1/2", row: "1/2" }],
        ["square2", { column: "2/3", row: "1/2" }],
        ["square3", { column: "3/4", row: "1/2" }],
        ["square4", { column: "1/2", row: "2/3" }],
        ["square5", { column: "2/3", row: "2/3" }],
        ["square6", { column: "3/4", row: "2/3" }],
        ["square7", { column: "1/2", row: "3/4" }],
        ["square8", { column: "2/3", row: "3/4" }],
        ["square9", { column: "3/4", row: "3/4" }],
    ]);

    const areEqual = (newMap) => {
        const newOrderMap = new Map([...newMap].sort());
        return (
            JSON.stringify([...gridInfo]) === JSON.stringify([...newOrderMap])
        );
    };

    const shuffleMap = (map) => {
        let keys = Array.from(map.keys());
        keys.sort(() => Math.random() - 0.5);
        let values = Array.from(map.values());
        values.sort(() => Math.random() - 0.5);
        let shuffledMap = new Map();
        for (let i = 0; i < keys.length; i++) {
            shuffledMap.set(keys[i], values[i]);
        }
        movesSoFar = 0;
        return shuffledMap;
    };

    let shuffledGridInfo = shuffleMap(gridInfo);

    const checkMoveIsValid = (tileInfo, whiteTileInfo) => {
        const [columnTile, rowTile] = tileInfo;
        const [columnWhiteTile, rowWhiteTile] = whiteTileInfo;
        const sameColumn = columnTile == columnWhiteTile;
        const sameRow = rowTile == rowWhiteTile;
        if (!completed) {
            // 1. check if the clicked tile is white if true return false
            if (sameColumn && sameRow) {
                return false;
            }
            // 2. check if column or row matches with whiteTile counterpart
            else if (sameColumn || sameRow) {
                // 3. check if the non-matching is adjacent or not.
                const returnAdjacent = (config) => {
                    if (config == "1/2" || config == "3/4") {
                        return ["2/3"];
                    } else if (config == "2/3") {
                        return ["1/2", "3/4"];
                    }
                };
                if (sameColumn) {
                    const adjacentArray = returnAdjacent(rowTile);
                    return adjacentArray.includes(rowWhiteTile);
                } else if (sameRow) {
                    const adjacentArray = returnAdjacent(columnTile);
                    return adjacentArray.includes(columnWhiteTile);
                }
            } else {
                return false;
            }
        }
    };

    const moveTileAbstract = (id) => {
        const clickedTileInfo = shuffledGridInfo.get(id);
        const square9Info = shuffledGridInfo.get("square9");
        const validMove = checkMoveIsValid(
            [clickedTileInfo.column, clickedTileInfo.row],
            [square9Info.column, square9Info.row]
        );
        if (validMove) {
            let gridInfoTemp = shuffledGridInfo;
            gridInfoTemp.set("square9", clickedTileInfo);
            gridInfoTemp.set(id, square9Info);
            const checkCompleted = areEqual(gridInfoTemp);
            if (checkCompleted) {
                completed = true;
            } else {
                movesSoFar++;
            }
            return gridInfoTemp;
        } else {
            return shuffledGridInfo;
        }
    };

    function moveTile(id) {
        shuffledGridInfo = moveTileAbstract(id);
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgURL = e.target.result;
            customImageUrl = imgURL;
            setBackgroundImage(imgURL);
        };
        reader.readAsDataURL(file);
    }

    function setBackgroundImage(imgURL) {
        document.querySelectorAll(".puzzle-square").forEach((square: any) => {
            square.style.backgroundImage = `url(${imgURL})`;
        });
        shuffledGridInfo = shuffleMap(gridInfo);
    }
</script>

<center class="pt-24 md:pt-16 lg:pt-28">
    <h1 style:color={"white"}>Slide Puzzle</h1>

{#if !completed}
    <div style:color={"white"} style:padding-block={"1rem"} class="space-y-5">
        <span class="py-2">Select custom image:</span>
        <input
            type="file"
            id="fileInput"
            on:change={handleFileSelect}
            accept="image/*"
            />
    </div>
{/if}

<div class="puzzle-container">
    {#each tiles as tile}
        <div
            on:click={moveTile.bind(null, tile)}
            class="puzzle-square"
            id={completed && tile == "square9" ? `square9Completed` : tile}
            style:grid-column={shuffledGridInfo.get(tile).column}
            style:grid-row={shuffledGridInfo.get(tile).row}
            on:keypress={moveTile.bind(null, tile)}
            style:backgroundImage={customImageUrl && customImageUrl}
        >
            <div
                class="tileNumber"
                style:display={completed || tile.split("square")[1] == "9"
                    ? `none`
                    : `block`}
            >
                {tile.split("square")[1]}
            </div>
        </div>
    {/each}
</div>

<div class="footer">
    <div>
        Slide Puzzle made with Svelte 🤍
    </div>
    <div>
        <a href="https://github.com/adharshchottu/slidepuzzle.git" style="text-decoration:none; color:wheat;">
            GitHub repo
        </a>
    </div>
</div>

</center>
<Modal isOpen={completed}>
    <h2 style:color={"#6c95ec"}>Congratulations!🥳💯👏</h2>
    <div style:color={"#6c95ec"}>
        You completed the puzzle in {movesSoFar + 1} moves
    </div>
</Modal>


<style>
    .puzzle-container {
        width: 30rem;
        height: 30rem;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
    }

    .puzzle-square {
        float: left;
        margin: 3px;
        background-image: url("https://www.typinks.com/images/favicon.jpg");
        background-size: 300% 300%;
        font-size: large;
        color: #3a4042;
        border: 2px solid #aaa6a4;
    }

    .tileNumber {
        background-color: #aaa6a4;
        height: auto;
        width: 1rem;
        position: relative;
        margin: 0.5rem;
        /* left: 10rem; */
        border-radius: 1rem;
        padding: 0.05rem;
        border: 2px solid #3a4042;
        opacity: 0.5;
    }

    #square1 {
        background-position-x: 0;
        background-position-y: 0;
    }

    #square2 {
        background-position-x: 50.1%;
        background-position-y: 0;
    }

    #square3 {
        background-position-x: 99.9%;
        background-position-y: 0;
    }

    #square4 {
        background-position-x: 0;
        background-position-y: 50.1%;
    }

    #square5 {
        background-position-x: 50.1%;
        background-position-y: 50.1%;
    }

    #square6 {
        background-position-x: 99.9%;
        background-position-y: 50.1%;
    }

    #square7 {
        background-position-x: 0;
        background-position-y: 99.9%;
    }

    #square8 {
        background-position-x: 50.1%;
        background-position-y: 99.9%;
    }

    #square9 {
        background-size: 0;
        border: none;
    }

    #square9Completed {
        background-position-x: 99.9%;
        background-position-y: 99.9%;
        background-size: 300% 300%;
        border: 2px solid #aaa6a4;
    }

    @media (max-width: 767px) {
        .puzzle-container {
            width: 20rem;
            height: 20rem;
            margin: 0 auto;
        }
    }

    .footer{
        margin-top:5rem;
        bottom:0;
        display:flex;
        font-size: 18px;
        flex-direction:column;
        color:white;
    }
</style>