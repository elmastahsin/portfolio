export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // HTML or Markdown formatted content
  category: string;
  date: string;
  readTime: string;
  coverImage?: string;
  author: string;
  tags?: string[];
}

export const initialBlogs: BlogPost[] = [
  {
    id: "post-1",
    slug: "optimizing-distributed-locks-in-go",
    title: "Optimizing Distributed Locks in Go using Redis and Redlock",
    summary: "An in-depth analysis of managing concurrent critical sections in high-throughput Go microservices using Redis cluster locks. We cover deadlocks, token expiration safety, and network partition resiliency.",
    content: `
      <h2>The Challenge of Distributed Concurrency</h2>
      <p>In distributed microservice architectures, managing concurrent operations on shared resources is a critical requirement. When scaled across multiple replicas, traditional Go primitives like <code>sync.Mutex</code> are insufficient because they only coordinate threads within a single operating system process.</p>
      
      <p>To coordinate actions across separate compute instances, we must introduce a central locking service. Redis is widely adopted for this role due to its high throughput, memory-based operations, and single-threaded execution design.</p>
      
      <h2>Implementing the Basic Lock (SETNX)</h2>
      <p>The simplest locking implementation in Redis utilizes the <code>SET</code> command with the <code>NX</code> (Not eXists) option and a <code>PX</code> (expiration time in milliseconds) modifier:</p>
      
      <pre><code>SET resource_lock my_random_token NX PX 30000</code></pre>
      
      <p>This command guarantees that the lock can only be acquired if it does not already exist, and sets an auto-expire TTL (Time-To-Live) of 30,000ms to prevent resource deadlocks in case the acquiring service crashes.</p>
      
      <h3>The Importance of Random Tokens</h3>
      <p>When releasing the lock, it is vital to check if the token held in the database matches the token created by the locker. This prevents a service replica from accidentally deleting a lock that has expired and been acquired by another instance. We use a Lua script to perform the check-and-delete atomic execution:</p>
      
      <pre><code>if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
else
    return 0
end</code></pre>
      
      <h2>Scaling to Redlock</h2>
      <p>For mission-critical billing services, relying on a single Redis master represents a single point of failure (SPOF). The <strong>Redlock algorithm</strong> solves this by acquiring locks across N independent Redis nodes (typically 5 nodes). A lock is successfully acquired if a majority (at least 3 of 5) agree, with the time elapsed during acquisition subtracted from the TTL.</p>
      
      <p>By implementing Redlock, we managed to process 5,000 requests/second concurrently with zero race conditions, improving overall service resiliency during node failover from 99.9% to 99.999%.</p>
    `,
    category: "Backend",
    date: "June 18, 2026",
    readTime: "5 min read",
    author: "Alex Rivera",
    tags: ["Go", "Redis", "Distributed Systems", "Concurrency"]
  },
  {
    id: "post-2",
    slug: "fine-tuning-llms-on-edge-wasm",
    title: "Fine-Tuning LLMs on Edge Devices with WebAssembly and SIMD",
    summary: "Exploring how modern browser features like WebAssembly SIMD and WebGPU enable low-latency neural network inference and privacy-preserving federated training directly on consumer clients.",
    content: `
      <h2>Why Edge Intelligence Matters</h2>
      <p>Running Large Language Models (LLMs) on cloud servers incurs substantial infrastructure and network latency costs. Additionally, uploading confidential user logs to cloud pipelines poses serious privacy compliance concerns. Moving model execution to client devices solves these problems at the source.</p>
      
      <p>Historically, edge AI was restricted to static, small models. Today, WebAssembly (Wasm) combined with Single Instruction Multiple Data (SIMD) hardware acceleration makes running 1B to 3B parameter models in consumer browsers a reality.</p>
      
      <h2>Harnessing WebAssembly SIMD</h2>
      <p>SIMD (Single Instruction Multiple Data) allows processors to perform mathematical actions (multiplications and additions) on vector registers concurrently rather than scalar cycles. In matrix multiplication operations—the core workload of neural network layers—SIMD increases processing performance significantly.</p>
      
      <p>By compiling C++ or Rust matrix multiplication kernels to Wasm bytecode with SIMD enabled (using flags like <code>-msimd128</code>), we tap into the user's local CPU vector architecture. This yields a 3x to 5x speedup compared to standard scalar WebAssembly.</p>
      
      <h2>Integrating WebGPU for Accelerated Inference</h2>
      <p>For large-scale parameters, WebGPU provides direct GPU-pipeline access to the browser, bypassing older WebGL limits. WebGPU shader code can parallelize tensor operations, achieving smooth token generation rates on consumer laptops.</p>
      
      <pre><code>// WebGPU Shader Module (WGSL) matrix multiply sample
@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id : vec3&lt;u32&gt;) {
    // Parallel tensor calculations here...
}</code></pre>
      
      <h2>Federated Training and Results</h2>
      <p>We implemented a client-side fine-tuning adapter using gradient updates computed locally over user documents. The updated adapter weights are uploaded in batches using a federated aggregation server. This pipeline maintains total user data privacy, keeping personal notes entirely local while still improving the model's accuracy on specialized contexts by 22%.</p>
    `,
    category: "AI & ML",
    date: "May 25, 2026",
    readTime: "7 min read",
    author: "Alex Rivera",
    tags: ["WebAssembly", "WebGPU", "AI", "SIMD", "Rust"]
  }
];
