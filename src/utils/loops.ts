type IAsyncWhileLoopArgs = {
    loopCount: number;
    functionToFire: (index: number) => Promise<any>;
};

type IAsyncWhileLoopFn = (args: IAsyncWhileLoopArgs) => Promise<void>;

const asyncWhileLoop: IAsyncWhileLoopFn = async (args) => {
    let currLoopIndex = 0;

    let { loopCount, functionToFire } = args;

    while (currLoopIndex < loopCount) {
        await functionToFire(currLoopIndex);
        currLoopIndex++;
    }
};

const loops = {
    asyncWhileLoop
}

export { loops }
