// "taken" from: https://medium.com/@karenmarkosyan/how-to-manage-promises-into-dynamic-queue-with-vanilla-javascript-9d0d1f8d4df5
export class PromiseQueueUtility {
    static enqueue(promise) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promise,
                resolve,
                reject,
            });
            this.dequeue();
        });
    }
    static dequeue() {
        if (this.workingOnPromise) {
            return false;
        }
        const item = this.queue.shift();
        if (!item) {
            return false;
        }
        try {
            this.workingOnPromise = true;
            item.promise()
                .then((value) => {
                this.workingOnPromise = false;
                item.resolve(value);
                this.dequeue();
            })
                .catch((err) => {
                this.workingOnPromise = false;
                item.reject(err);
                this.dequeue();
            });
        }
        catch (err) {
            this.workingOnPromise = false;
            item.reject(err);
            this.dequeue();
        }
        return true;
    }
}
PromiseQueueUtility.queue = [];
PromiseQueueUtility.workingOnPromise = false;
//# sourceMappingURL=promiseQueue.utility.js.map