-- 1. Create Profile Table
CREATE TABLE IF NOT EXISTS portfolio_profile (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  cv_url TEXT,
  profile_image TEXT,
  theme_color TEXT DEFAULT 'emerald',
  socials JSONB DEFAULT '{}'::jsonb,
  about JSONB DEFAULT '{}'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_single_row CHECK (id = 1)
);

-- 2. Create Blogs Table
CREATE TABLE IF NOT EXISTS portfolio_blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  read_time TEXT NOT NULL,
  cover_image TEXT,
  author TEXT NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Seed Default Profile Data (Alex Rivera)
INSERT INTO portfolio_profile (
  id, name, title, tagline, location, email, cv_url, profile_image, theme_color, socials, about, skills
) VALUES (
  1,
  'Alex Rivera',
  'AI Engineer & Distributed Systems Specialist',
  'Bridging the gap between scalable high-performance backend systems and state-of-the-art machine learning models.',
  'San Francisco, CA',
  'alex.rivera@example.com',
  '#',
  '/images/profile.jpg',
  'emerald',
  '{
    "github": "https://github.com",
    "linkedin": "https://linkedin.com",
    "email": "mailto:alex.rivera@example.com",
    "twitter": "https://twitter.com",
    "medium": "https://medium.com",
    "scholar": "https://scholar.google.com"
  }'::jsonb,
  '{
    "bio": "I am a software engineer and AI researcher focused on designing and implementing distributed systems that train and serve large-scale machine learning models. I enjoy solving complex performance bottlenecks across the stack—from database query optimization to GPU kernel efficiency. With experience in both rapid-growth startups and university research labs, I bring a rigorous engineering mindset to AI development.",
    "currentRole": "Lead AI Systems Engineer at SynthAI Labs",
    "educationSummary": "M.S. in Computer Science from Stanford University",
    "careerFocus": "Building next-generation infrastructure for collaborative and decentralized machine learning, ensuring safety, efficiency, and high scalability.",
    "interests": ["Large Language Models", "Distributed GPU Orchestration", "Vector Databases", "Edge Computing", "Privacy-Preserving AI"]
  }'::jsonb,
  '[
    { "title": "Backend Development", "items": ["Go", "Python", "Rust", "TypeScript", "Node.js", "gRPC", "FastAPI"] },
    { "title": "Frontend & Mobile", "items": ["React", "Next.js", "Tailwind CSS", "React Native", "SwiftUI"] },
    { "title": "AI / Machine Learning", "items": ["PyTorch", "Hugging Face", "Transformers", "Scikit-Learn", "LangChain", "TensorFlow"] },
    { "title": "Databases & Cache", "items": ["PostgreSQL", "Redis", "Pinecone", "MongoDB", "ClickHouse", "SQLite"] },
    { "title": "DevOps & Tools", "items": ["Docker", "Kubernetes", "AWS", "GitHub Actions", "Terraform", "Prometheus"] },
    { "title": "Architecture & Standards", "items": ["Microservices", "Event-Driven Systems", "System Design", "AWS Solutions Architect"] }
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 4. Seed Default Blogs
INSERT INTO portfolio_blogs (
  id, slug, title, summary, content, category, date, read_time, author, tags
) VALUES (
  'post-1',
  'optimizing-distributed-locks-in-go',
  'Optimizing Distributed Locks in Go using Redis and Redlock',
  'An in-depth analysis of managing concurrent critical sections in high-throughput Go microservices using Redis cluster locks. We cover deadlocks, token expiration safety, and network partition resiliency.',
  '<h2>The Challenge of Distributed Concurrency</h2><p>In distributed microservice architectures, managing concurrent operations on shared resources is a critical requirement. When scaled across multiple replicas, traditional Go primitives like <code>sync.Mutex</code> are insufficient because they only coordinate threads within a single operating system process.</p><p>To coordinate actions across separate compute instances, we must introduce a central locking service. Redis is widely adopted for this role due to its high throughput, memory-based operations, and single-threaded execution design.</p><h2>Implementing the Basic Lock (SETNX)</h2><p>The simplest locking implementation in Redis utilizes the <code>SET</code> command with the <code>NX</code> (Not eXists) option and a <code>PX</code> (expiration time in milliseconds) modifier:</p><pre><code>SET resource_lock my_random_token NX PX 30000</code></pre><p>This command guarantees that the lock can only be acquired if it does not already exist, and sets an auto-expire TTL (Time-To-Live) of 30,000ms to prevent resource deadlocks in case the acquiring service crashes.</p><h3>The Importance of Random Tokens</h3><p>When releasing the lock, it is vital to check if the token held in the database matches the token created by the locker. This prevents a service replica from accidentally deleting a lock that has expired and been acquired by another instance. We use a Lua script to perform the check-and-delete atomic execution:</p><pre><code>if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end</code></pre><h2>Scaling to Redlock</h2><p>For mission-critical billing services, relying on a single Redis master represents a single point of failure (SPOF). The <strong>Redlock algorithm</strong> solves this by acquiring locks across N independent Redis nodes (typically 5 nodes). A lock is successfully acquired if a majority (at least 3 of 5) agree, with the time elapsed during acquisition subtracted from the TTL.</p><p>By implementing Redlock, we managed to process 5,000 requests/second concurrently with zero race conditions, improving overall service resiliency during node failover from 99.9% to 99.999%.</p>',
  'Backend',
  'June 18, 2026',
  '5 min read',
  'Alex Rivera',
  '["Go", "Redis", "Distributed Systems", "Concurrency"]'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO portfolio_blogs (
  id, slug, title, summary, content, category, date, read_time, author, tags
) VALUES (
  'post-2',
  'fine-tuning-llms-on-edge-wasm',
  'Fine-Tuning LLMs on Edge Devices with WebAssembly and SIMD',
  'Exploring how modern browser features like WebAssembly SIMD and WebGPU enable low-latency neural network inference and privacy-preserving federated training directly on consumer clients.',
  '<h2>Why Edge Intelligence Matters</h2><p>Running Large Language Models (LLMs) on cloud servers incurs substantial infrastructure and network latency costs. Additionally, uploading confidential user logs to cloud pipelines poses serious privacy compliance concerns. Moving model execution to client devices solves these problems at the source.</p><p>Historically, edge AI was restricted to static, small models. Today, WebAssembly (Wasm) combined with Single Instruction Multiple Data (SIMD) hardware acceleration makes running 1B to 3B parameter models in consumer browsers a reality.</p><h2>Harnessing WebAssembly SIMD</h2><p>SIMD (Single Instruction Multiple Data) allows processors to perform mathematical actions (multiplications and additions) on vector registers concurrently rather than scalar cycles. In matrix multiplication operations—the core workload of neural network layers—SIMD increases processing performance significantly.</p><p>By compiling C++ or Rust matrix multiplication kernels to Wasm bytecode with SIMD enabled (using flags like <code>-msimd128</code>), we tap into the user''s local CPU vector architecture. This yields a 3x to 5x speedup compared to standard scalar WebAssembly.</p><h2>Integrating WebGPU for Accelerated Inference</h2><p>For large-scale parameters, WebGPU provides direct GPU-pipeline access to the browser, bypassing older WebGL limits. WebGPU shader code can parallelize tensor operations, achieving smooth token generation rates on consumer laptops.</p><pre><code>// WebGPU Shader Module (WGSL) matrix multiply sample\n@compute @workgroup_size(16, 16)\nfn main(@builtin(global_invocation_id) global_id : vec3&lt;u32&gt;) {\n    // Parallel tensor calculations here...\n}</code></pre><h2>Federated Training and Results</h2><p>We implemented a client-side fine-tuning adapter using gradient updates computed locally over user documents. The updated adapter weights are uploaded in batches using a federated aggregation server. This pipeline maintains total user data privacy, keeping personal notes entirely local while still improving the model''s accuracy on specialized contexts by 22%.</p>',
  'AI & ML',
  'May 25, 2026',
  '7 min read',
  'Alex Rivera',
  '["WebAssembly", "WebGPU", "AI", "SIMD", "Rust"]'::jsonb
) ON CONFLICT (id) DO NOTHING;
