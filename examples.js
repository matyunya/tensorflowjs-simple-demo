import tf from "/tf.js";

class Examples {
  constructor(props, { output }) {
    this.output = output;
    this.update(props);
  }

  async update({ data }) {
    this.data = data;
    const samples = await this.run();
    this.output(samples);
  }

  async run() {
    if (!this.data || !this.data.nextTestBatch) return;

    const examples = this.data.nextTestBatch(50);

    return Promise.all(
      Array.from(Array(50).keys())
        .map(async (_, i) => {
          const imageTensor = tf.tidy(() => {
            // Reshape the image to 28x28 px
            return examples.xs
              .slice([i, 0], [1, examples.xs.shape[1]])
              .reshape([28, 28, 1]);
          });

          const canvas = document.createElement('canvas');
          canvas.width = 28;
          canvas.height = 28;
          canvas.style = 'margin: 0 2px;';
          await tf.browser.toPixels(imageTensor, canvas);

          imageTensor.dispose();

          return canvas;
        })
    );
  }
}

export const render = (nodes) => ({
  nodes,
  __EllxMeta__: {
    component: class {
      constructor(props) {
        this.update(props);
      }
      update({ nodes = [] }) {
        this.nodes = (Array.isArray(nodes) ? nodes : [nodes]).filter(n => Boolean(n) && n instanceof Node);
      }
      render(n) {
        this.nodes.forEach(node => n && n.appendChild && n.appendChild(node));
      }
      dispose() {
        this.nodes.forEach(node => node.parentNode && node.parentNode.removeChild(node));
      }
    }
  }
})

export const getExamples = (data) => ({
  data,
  __EllxMeta__: {
    component: Examples
  }
});
