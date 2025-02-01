import { Tensor } from "./tensorscript";
import { LazyTensor, updateSGD } from "./lazy";

main();

async function main() {
	const adapter = await navigator.gpu.requestAdapter();
	const device = await adapter.requestDevice();
	Tensor.setDevice(device);

	// await mulBackwardExample();
	// await scalarForwardExample();
	// await numberBinaryOpExample();
	// await expandExample2();
	// await sumGradExample();
	await linearRegressionExample();
	// await expandExample();
	// await unsqueezeExample();
	// await copyExample();
	// await divExample();
	// await matmulExample3();
	// await matmulExample2();
	// await powExample();
	// await mulExample();
	// await subExample();
	// await addExample();
	// await sumExample();
	// await inverseIndexing();
	// await inverseIndexing31();
}

async function mulBackwardExample() {
	const y = LazyTensor.tensor(await Tensor.tensor([1, 2, 3, 4], [4, 1]));
	await y.print();

	const mean = y.sum(0).mul(1 / 4);

	await mean.forward();
	await mean.print();

	await mean.backward();
	await y.grad.print();
}
async function scalarForwardExample() {
	const y = LazyTensor.tensor(await Tensor.tensor([1, 2, 3, 4], [4, 1]));
	await y.print();

	const square = y.square();
	const summed = square.sum(0);

	await summed.forward();

	await square.print();
	await summed.print();

	await summed.backward();
	await y.grad.print();
}
async function sumGradExample() {
	const y = LazyTensor.tensor(await Tensor.tensor([1, 2, 3, 4], [4, 1]));
	const yhat = LazyTensor.tensor(await Tensor.tensor([1, 0, 3, 1], [4, 1]));
	const loss = y.add(yhat);
	await loss.forward(); // now compute everything (the c = a + b)
	await c.print();
	await c.backward(); // backprop
	console.log("a.grad");
	await a.grad.print();
	console.log("b.grad");
	await b.grad.print();
}

async function divExample() {
	const a = await Tensor.tensor([0, 1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
	const b = await Tensor.fill(2, a.shape);
	const c = await a.div(b);

	console.log("a");
	await a.print();

	console.log("b");
	await b.print();

	console.log("c = a/b");
	await c.print();
}
async function mulExample() {
	const a = await Tensor.tensor([0, 1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
	const b = await Tensor.fill(-1, a.shape);
	const c = await a.mul(b);

	console.log("a");
	await a.print();

	console.log("b");
	await b.print();

	console.log("c = a*b");
	await c.print();
}

async function subExample() {
	const a = await Tensor.tensor([0, 1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
	const b = await Tensor.fill(1, a.shape);
	const c = await a.sub(b);

	console.log("a");
	await a.print();

	console.log("b");
	await b.print();

	console.log("c = a-b");
	await c.print();
}

async function addExample() {
	const a = await Tensor.tensor([0, 1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
	const b = await Tensor.fill(1, a.shape);
	const c = await a.add(b);

	console.log("a");
	await a.print();

	console.log("b");
	await b.print();

	console.log("c = a+b");
	await c.print();
}

async function sumExample() {
	const a = await Tensor.tensor([0, 1, 2, 3, 4, 5, 6, 7], [2, 2, 2], "f32");
	console.log("a");
	await a.print();

	console.log("Sum across");
	await (await a.sum(-1)).print();
}
async function transposeExample() {
	const a = await Tensor.tensor([1, 2, 3], [3, 1]);
	console.log("a");
	await a.print();

	console.log("a.transpose()");
	await a.transpose().print();

	console.log("a.T");
	await a.T.print();
}
async function powExample() {
	const a = await Tensor.tensor([1, 2, -3], [3, 1], "f32");
	const b = await Tensor.fill(2, a.shape);
	const c = await a.pow(b);

	console.log("a");
	await a.print();

	console.log("b");
	await b.print();

	console.log("c=a^b");
	await c.print();
}
async function randomExample() {
	const a = await Tensor.random([4, 1], "f32");
	await a.print();
}
async function fillExample() {
	const a = await Tensor.fill(1, [2, 2, 2], "u32");
	await a.print();
}

async function inverseIndexing() {
	const a = await Tensor.tensor([0, 1, 2, 3, 4, 5, 6, 7], [2, 2, 2], "f32");
	const c = a.transpose([0, 2, 1]);

	await c.print();
	for (let i = 0; i < 4; i++) {
		const idx = [Math.floor(i / c.shape[1]) % c.shape[0], Math.floor(i) % c.shape[1]];
		const wgslIdx = wgslBaseIdx(c.shape, c.strides, `${i}`, -2, "Math.floor");
		const a = eval(wgslIdx);

		console.log(idx[0] * c.strides[0] + idx[1] * c.strides[1]);
		console.log(a);
	}
}

async function inverseIndexing31() {
	const c = await Tensor.fill(1, [3, 2], "f32");
	c.print();

	for (let i = 0; i < 6; i++) {
		const idx = [Math.floor(i / c.shape[1]) % c.shape[0], Math.floor(i) % c.shape[1]];
		const wgslIdx = wgslBaseIdx(c.shape, c.strides, `${i}`, -1, "Math.floor");
		const a = eval(wgslIdx);

		console.log(idx[0] * c.strides[0] + idx[1] * c.strides[1], a);
		// console.log(idx);
	}
}

async function matmulExample3() {
	const a = await Tensor.tensor([1, 2, 3, 4, 5, 6], [2, 3]);
	const b = await Tensor.tensor([0, 1, 2, 3, 4, 5], [3, 2]);
	const c = await a.matmul(b);

	await a.print();
	await b.print();

	console.log("GPU RESULT");
	await c.print();
}

async function matmulExample2() {
	const shape = [784, 784];
	const a = await Tensor.fill(1, shape);
	const b = await Tensor.fill(1, shape);
	const c = await Tensor.empty(shape);
	await Tensor.matmul(c, a, b);

	await a.print();
	await b.print();

	console.log("GPU RESULT");
	await c.print();

	cpuMatmul: {
		const acpu = await a.cpuBuffer();
		const bcpu = await b.cpuBuffer();
		const ccpu = new Float32Array(length(c.shape));
		const m = a.shape[0];
		const n = a.shape[1];
		const l = b.shape[1];
		for (let i = 0; i < m; i++) {
			for (let j = 0; j < l; j++) {
				let cidx = i * c.strides[0] + j * c.strides[1];
				for (let k = 0; k < n; k++) {
					let aidx = i * a.strides[0] + k * a.strides[1];
					let bidx = k * b.strides[0] + j * b.strides[1];
					ccpu[cidx] += acpu[aidx] * bcpu[bidx];
				}
			}
		}
		console.log("CPU COMPUTED ACTUAL RESULT!");
		console.log(ndarrayToString(ccpu, c.shape, c.strides, 8));
	}
}
async function matmulExample() {
	const a = await Tensor.tensor([1, 2, 3, 4, 5, 6], [2, 3]);
	const b = await Tensor.tensor([0, 1, 2, 3, 4, 5], [3, 2]);
	const c = await Tensor.empty([a.shape[0], b.shape[1]]);
	await Tensor.matmul(c, a, b);

	await a.print();
	await b.print();

	console.log("GPU RESULT");
	await c.print();

	cpuMatmul: {
		const acpu = await a.cpuBuffer();
		const bcpu = await b.cpuBuffer();
		const ccpu = [0, 0, 0, 0];
		const m = a.shape[0];
		const n = a.shape[1];
		const l = b.shape[1];
		for (let i = 0; i < m; i++) {
			for (let j = 0; j < l; j++) {
				let cidx = i * c.strides[0] + j * c.strides[1];
				for (let k = 0; k < n; k++) {
					let aidx = i * a.strides[0] + k * a.strides[1];
					let bidx = k * b.strides[0] + j * b.strides[1];
					ccpu[cidx] += acpu[aidx] * bcpu[bidx];
				}
			}
		}
		console.log("CPU COMPUTED ACTUAL RESULT!");
		console.log(ndarrayToString(ccpu, c.shape, c.strides));
	}
}

async function copyExample() {
	const a = await Tensor.tensor([1, 2, 3, 4], [2, 2]);
	const aT = a.T;

	console.log("a");
	await a.print();

	console.log("a.T");
	await aT.print();

	console.log("a.T buffer", await aT.cpuBuffer());
	console.log();
	console.log("a.T.contiguous() buffer", await (await aT.contiguous()).cpuBuffer());
}

async function linearRegressionExample() {
	const n = 100;
	const line = Array(n)
		.fill(0)
		.map((_, i) => i);
	const x = LazyTensor.tensor(await (await Tensor.tensor(line, [n, 1])).mul(1 / n));
	const y = LazyTensor.tensor(await (await Tensor.tensor(line, [n, 1])).mul(1 / n));
	const w = LazyTensor.tensor(await Tensor.tensor([0.5], [1, 1]));
	const tunableParams = [w];

	const iterations = 100;
	const lr = 0.1;

	const yhat = x.matmul(w);
	const loss = yhat
		.sub(y)
		.square()
		.sum(0)
		.mul(1 / n); // mse loss

	console.time("iteration");
	for (let i = 0; i < iterations; i++) {
		console.log("ITER", i);
		await loss.forward();
		loss.zeroGrad(); // make sure we accumulate grads from 0
		await loss.backward();
		await updateSGD(tunableParams, lr);
	}
	console.timeEnd("iteration");

	console.log("W");
	await w.print();
	console.log("LOSS");
	await loss.print();
}

async function unsqueezeExample() {
	const a = await Tensor.tensor([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 2]);
	await a.print();
	await a.unsqueeze(0).print();
}

async function expandExample() {
	const a = await Tensor.tensor([1, 2, 3], [1, 3]);
	await a.print();
	console.log("expand the first dimension to 3");
	await a.expandTo(3, 0).print();

	console.log("useful example");
	let scalar = await Tensor.tensor([7], [1, 1]);
	const tensor = await Tensor.tensor([1, 2, 3, 4], [2, 2]);

	console.log("scalar");
	await scalar.print();
	console.log("tensor");
	await tensor.print();

	// scalar.mul(tensor) fails since tensor.shape != scalar.shape
	// instead expand to shape [2,2] ↓
	scalar = scalar.expandTo(2, 0).expandTo(2, 1);

	console.log("scalar expanded");
	await scalar.print();

	console.log("scalar*tensor now works");
	const result = await scalar.mul(tensor);
	await result.print();
}

async function expandExample2() {
	let scalar = await Tensor.tensor([7], [1, 1]);
	const tensor = await Tensor.tensor([1, 2, 3, 4], [2, 2]);

	console.log("scalar");
	await scalar.print();
	console.log("tensor");
	await tensor.print();

	console.log("scalar expanded");
	await scalar.expand(tensor.shape).print();

	console.log("scalar*tensor now works");
	const result = await scalar.expand(tensor.shape).mul(tensor);
	await result.print();
}

async function numberBinaryOpExample() {
	const tensor = await Tensor.tensor([1, 2, 3, 4], [2, 2]);
	await tensor.print();
	await (await tensor.div(2)).print();
	await (await tensor.mul(2)).print();
	await (await tensor.add(2)).print();
	await (await tensor.pow(2)).print();
}
