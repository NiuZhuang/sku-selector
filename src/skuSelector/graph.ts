export default class Graph {
    nodes: Set<number>;
  
    edges: Map<number, Set<number>>;
  
    nonEdges: Map<number, Set<number>>;
  
    constructor(matrix: number[][]) {
      this.nodes = new Set(); // 顶点
      this.edges = new Map(); // 可联通的边；邻接表
      this.nonEdges = new Map(); // 不可联通的边；邻接表
  
      if (matrix) {
        this.initFromMatrix(matrix);
      }
    }
  
    initFromMatrix(matrix: number[][]) {
      //  每一行都是可以连通的，构造邻接表 edges
      matrix.forEach((row) => {
        row.forEach((key) => {
          this.addNode(key);
          this.addEdge(key, row);
        });
      });
    }
  
    addNode(value: number) {
      this.nodes.add(value);
    }
  
    addEdge(key: number, list: number[]) {
      let edgeSet = this.edges.get(key);
      if (!edgeSet) {
        edgeSet = new Set(list);
      } else {
        edgeSet = new Set([...Array.from(edgeSet), ...list]);
      }
      this.edges.set(key, edgeSet);
    }
  
    generateNonEdge() {
      this.edges.forEach((value: Set<number>, key: number) => {
        this.nonEdges.set(key, new Set(Array.from(this.nodes).filter((x) => !value.has(x))));
      });
    }
  }
  