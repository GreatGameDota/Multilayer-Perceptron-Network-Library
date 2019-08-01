import mf from '../utils/MatrixFunctions';

class LinearLayer {
	W = [];
	W_shape = [];
	b = [];
	b_shape = [];
	A_prev = [ 0 ];
	A_prev_shape = [ 0, 0 ];
	dA_prev = [ 0 ];
	dA_prev_shape = [ 0, 0 ];
	db = [ 0 ];
	db_shape = [ 0, 0 ];
	dW = [ 0 ];
	dW_shape = [ 0, 0 ];
	Z = [ 0 ];
	Z_shape = [ 0, 0 ];
	constructor (units, inputShape, init_type, prevWeightShape) {
		if (inputShape != 0 && prevWeightsShape == null) {
			n_in = inputShape;
		} else {
			try {
				n_in = prevWeightShape[0];
			} catch (e) {
				console.log('First layer must have an input shape');
			}
		}
		n_out = units;
		temp = [];
		for (let i = 0; i < n_in * n_out; i++) {
			if (init_type == 'plain') {
				temp.push(randGaussian());
			}
			if (init_type == 'xavier') {
				temp.push(randGaussian() / Math.sqrt(n_in));
			}
			if (init_type == 'he') {
				temp.push(randGaussian() * Math.sqrt(2 / n_in));
			}
		}
		this.W = temp;
		this.W_shape.push(n_out);
		this.W_shape.push(n_in);
		for (let i = 0; i < n_out; i++) {
			this.b.push(0);
		}
		this.b_shape.push(n_out);
		this.b_shape.push(0);
	}
	linearForward (A_prev, row, col) {
		this.A_prev = A_prev;
		this.A_prev_shape = [ row, col ];
		[ temp, temp_shape ] = mf.dot(this.W_shape[0], this.W_shape[1], row, col, this.W, A_prev);
		[ temp2, temp2_shape ] = mf.add(temp_shape[0], temp_shape[1], this.b_shape[0], this.b_shape[1], temp, this.b);
		this.Z = temp2;
		this.Z_shape = temp2_shape;
	}
	linearBackward (upstream_grad, row, col) {
		[ temp, temp_shape ] = mf.transpose(this.A_prev, this.A_prev_shape[0], this.A_prev_shape[1]);
		[ temp2, temp2_shape ] = mf.dot(row, col, temp_shape[0], temp_shape[1], upstream_grad, temp);
		this.dW = temp2;
		this.dW_shape = temp2_shape;
		[ temp3, temp3_shape ] = mf.sum(upstream_grad, row, col, 1);
		this.db = temp3;
		this.db_shape = temp3_shape;
		[ temp4, temp4_shape ] = mf.transpose(this.W, this.W_shape[0], this.W_shape[1]);
		[ temp5, temp5_shape ] = mf.dot(temp4_shape[0], temp4_shape[1], row, col, temp4, upstream_grad);
		this.dA_prev = temp5;
		this.dA_prev_shape = temp5_shape;
	}
}
function randGaussian () {
	return Math.random() > 0.5 ? Math.sqrt(-2 * Math.log(Math.random())) : -1 * Math.sqrt(-2 * Math.log(Math.random()));
}
