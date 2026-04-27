import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 8080;
const SECRET_KEY = 'your-secret-key-for-jwt';
app.use(cors());
app.use(express.json());

const users = {
  admin: { id: 1, username: 'admin', password: 'admin123', name: 'Admin User', role: 'ADMIN', email: 'admin@risksim.com' },
  manager: { id: 2, username: 'manager', password: 'manager123', name: 'Manager User', role: 'MANAGER', email: 'manager@risksim.com' },
  viewer: { id: 3, username: 'viewer', password: 'viewer123', name: 'Viewer User', role: 'VIEWER', email: 'viewer@risksim.com' }
};

const cats = ['Infrastructure','Cybersecurity','Financial','Operational','Compliance','Strategic'];
const statuses = ['OPEN','IN_PROGRESS','MITIGATED','CLOSED','CRITICAL'];
const impacts = ['LOW','MEDIUM','HIGH','CRITICAL'];
const likelihoods = ['LOW','MEDIUM','HIGH'];

const mockRisks = [
  {id:1,title:'Regional Data Center Power Failure',description:'Primary data center in US-East experiencing intermittent power supply issues due to aging UPS infrastructure. Risk of cascading failures across dependent microservices.',category:'Infrastructure',riskScore:8.5,impact:'CRITICAL',likelihood:'MEDIUM',status:'OPEN',mitigationPlan:'Deploy redundant UPS systems and implement automatic failover to US-West region within 30 seconds.',projectedCost:250000,createdAt:'2026-01-15T09:30:00Z',updatedAt:'2026-04-10T14:20:00Z'},
  {id:2,title:'SQL Injection in Legacy API Gateway',description:'Penetration testing revealed SQL injection vulnerability in the v1 authentication endpoint. Attacker could extract user credentials and session tokens.',category:'Cybersecurity',riskScore:9.2,impact:'CRITICAL',likelihood:'HIGH',status:'CRITICAL',mitigationPlan:'Implement parameterized queries, deploy WAF rules, and schedule emergency patch for v1 API gateway.',projectedCost:85000,createdAt:'2026-01-20T11:00:00Z',updatedAt:'2026-04-12T09:15:00Z'},
  {id:3,title:'Currency Exchange Rate Volatility',description:'Exposure to EUR/USD fluctuations impacting Q2 revenue projections by approximately 4.2%. Hedging strategy needs immediate review.',category:'Financial',riskScore:6.8,impact:'HIGH',likelihood:'MEDIUM',status:'IN_PROGRESS',mitigationPlan:'Engage treasury team to implement forward contracts covering 80% of projected EUR exposure for Q2-Q3.',projectedCost:180000,createdAt:'2026-02-01T08:45:00Z',updatedAt:'2026-04-08T16:30:00Z'},
  {id:4,title:'Supply Chain Semiconductor Shortage',description:'Critical chip shortage affecting production of IoT sensor modules. Lead times extended from 8 to 22 weeks.',category:'Operational',riskScore:7.5,impact:'HIGH',likelihood:'HIGH',status:'OPEN',mitigationPlan:'Diversify supplier base across 3 regions. Negotiate priority allocation with existing vendors.',projectedCost:420000,createdAt:'2026-02-10T14:00:00Z',updatedAt:'2026-04-05T11:20:00Z'},
  {id:5,title:'GDPR Data Retention Non-Compliance',description:'Audit revealed customer PII retained beyond 36-month regulatory limit in 3 legacy databases. Potential fine up to 4% of annual revenue.',category:'Compliance',riskScore:8.0,impact:'CRITICAL',likelihood:'MEDIUM',status:'IN_PROGRESS',mitigationPlan:'Implement automated data purge pipeline. Deploy retention policy enforcement across all databases by Q2.',projectedCost:150000,createdAt:'2026-02-15T10:30:00Z',updatedAt:'2026-04-11T13:45:00Z'},
  {id:6,title:'Market Entry Strategy - APAC Region',description:'Competitive analysis shows 3 new entrants in APAC market. Current market share at risk of 15% erosion over next 2 quarters.',category:'Strategic',riskScore:5.5,impact:'MEDIUM',likelihood:'MEDIUM',status:'OPEN',mitigationPlan:'Accelerate APAC partnership program. Launch localized product variants for JP and KR markets.',projectedCost:600000,createdAt:'2026-02-20T09:00:00Z',updatedAt:'2026-04-01T15:00:00Z'},
  {id:7,title:'Kubernetes Cluster Auto-Scaling Failure',description:'Production K8s cluster failed to auto-scale during Black Friday load test. Peak traffic caused 12-second response times.',category:'Infrastructure',riskScore:7.8,impact:'HIGH',likelihood:'MEDIUM',status:'MITIGATED',mitigationPlan:'Reconfigure HPA thresholds, add cluster autoscaler with pre-warming, implement load shedding.',projectedCost:95000,createdAt:'2026-02-25T16:00:00Z',updatedAt:'2026-04-09T10:00:00Z'},
  {id:8,title:'Ransomware Attack Vector via Email',description:'Phishing simulation showed 23% of employees clicked malicious links. Ransomware could encrypt critical business systems.',category:'Cybersecurity',riskScore:8.8,impact:'CRITICAL',likelihood:'HIGH',status:'OPEN',mitigationPlan:'Mandatory security awareness training, deploy advanced email filtering, implement network segmentation.',projectedCost:200000,createdAt:'2026-03-01T11:30:00Z',updatedAt:'2026-04-13T08:45:00Z'},
  {id:9,title:'Interest Rate Hike Impact on Credit Portfolio',description:'Projected 75bp rate increase will affect ₹191B credit portfolio. Expected increase in default rates by 1.8%.',category:'Financial',riskScore:6.2,impact:'HIGH',likelihood:'LOW',status:'IN_PROGRESS',mitigationPlan:'Stress test portfolio under multiple rate scenarios. Adjust risk appetite framework accordingly.',projectedCost:340000,createdAt:'2026-03-05T13:00:00Z',updatedAt:'2026-04-07T17:00:00Z'},
  {id:10,title:'Warehouse Automation System Downtime',description:'Robotic picking system averaging 4.2 hours unplanned downtime per week. Fulfillment SLAs at risk of breach.',category:'Operational',riskScore:5.8,impact:'MEDIUM',likelihood:'HIGH',status:'MITIGATED',mitigationPlan:'Implement predictive maintenance schedule. Deploy backup manual picking stations.',projectedCost:175000,createdAt:'2026-03-08T07:30:00Z',updatedAt:'2026-04-06T12:15:00Z'},
  {id:11,title:'SOC 2 Type II Audit Gap',description:'Internal pre-audit identified 7 control gaps in access management and change control processes.',category:'Compliance',riskScore:7.0,impact:'HIGH',likelihood:'MEDIUM',status:'IN_PROGRESS',mitigationPlan:'Remediate access control gaps. Implement automated change management workflow with approval chains.',projectedCost:120000,createdAt:'2026-03-10T10:00:00Z',updatedAt:'2026-04-14T09:30:00Z'},
  {id:12,title:'Product-Market Fit Drift in Enterprise Segment',description:'NPS scores dropped from 72 to 54 in enterprise segment over 6 months. Feature gap analysis shows 12 unmet requirements.',category:'Strategic',riskScore:6.5,impact:'HIGH',likelihood:'MEDIUM',status:'OPEN',mitigationPlan:'Form enterprise advisory board. Prioritize top 5 feature requests in next 2 sprint cycles.',projectedCost:280000,createdAt:'2026-03-12T15:30:00Z',updatedAt:'2026-04-03T14:00:00Z'},
  {id:13,title:'DNS Infrastructure Single Point of Failure',description:'All DNS resolution routes through single provider. Provider outage would render all services unreachable.',category:'Infrastructure',riskScore:8.2,impact:'CRITICAL',likelihood:'LOW',status:'MITIGATED',mitigationPlan:'Implement multi-provider DNS with automated failover. Add health checks with 30-second TTL.',projectedCost:45000,createdAt:'2026-03-14T08:00:00Z',updatedAt:'2026-04-10T11:00:00Z'},
  {id:14,title:'API Key Exposure in Public Repository',description:'Automated scanning detected 3 API keys committed to public GitHub repository. Keys provide access to payment processing sandbox.',category:'Cybersecurity',riskScore:7.2,impact:'HIGH',likelihood:'MEDIUM',status:'CLOSED',mitigationPlan:'Rotated all exposed keys. Implemented pre-commit hooks and secret scanning in CI/CD pipeline.',projectedCost:25000,createdAt:'2026-03-16T12:00:00Z',updatedAt:'2026-04-02T16:45:00Z'},
  {id:15,title:'Revenue Recognition Policy Change Impact',description:'New ASC 606 interpretation affects SaaS revenue timing. Potential ₹100M revenue deferral in Q3.',category:'Financial',riskScore:5.0,impact:'MEDIUM',likelihood:'LOW',status:'OPEN',mitigationPlan:'Engage external auditors for interpretation review. Model financial impact across 3 scenarios.',projectedCost:90000,createdAt:'2026-03-18T09:30:00Z',updatedAt:'2026-04-04T10:30:00Z'},
  {id:16,title:'Third-Party Logistics Provider Insolvency',description:'Primary 3PL provider showing financial distress signals. Handles 40% of outbound shipments.',category:'Operational',riskScore:6.0,impact:'HIGH',likelihood:'LOW',status:'OPEN',mitigationPlan:'Identify and onboard backup 3PL provider. Negotiate volume commitments to reduce dependency.',projectedCost:310000,createdAt:'2026-03-20T14:00:00Z',updatedAt:'2026-04-08T08:00:00Z'},
  {id:17,title:'PCI DSS v4.0 Migration Deadline',description:'New PCI DSS requirements effective Q3. Current payment infrastructure requires 14 configuration changes.',category:'Compliance',riskScore:7.5,impact:'HIGH',likelihood:'MEDIUM',status:'IN_PROGRESS',mitigationPlan:'Create PCI migration project plan. Engage QSA for gap assessment and remediation roadmap.',projectedCost:200000,createdAt:'2026-03-22T11:00:00Z',updatedAt:'2026-04-12T14:30:00Z'},
  {id:18,title:'Talent Acquisition Pipeline Bottleneck',description:'Engineering hiring velocity dropped 40%. Average time-to-fill increased from 45 to 78 days.',category:'Strategic',riskScore:4.5,impact:'MEDIUM',likelihood:'HIGH',status:'IN_PROGRESS',mitigationPlan:'Expand recruiter team. Launch employee referral bonus program. Partner with 3 coding bootcamps.',projectedCost:150000,createdAt:'2026-03-24T08:30:00Z',updatedAt:'2026-04-11T16:00:00Z'},
  {id:19,title:'Cloud Storage Encryption Key Rotation Failure',description:'Automated key rotation failed silently for 47 days. 2.3TB of data encrypted with expired keys.',category:'Infrastructure',riskScore:8.0,impact:'HIGH',likelihood:'LOW',status:'CLOSED',mitigationPlan:'Fixed rotation automation. Implemented monitoring alerts for key lifecycle events with PagerDuty.',projectedCost:55000,createdAt:'2026-03-26T10:00:00Z',updatedAt:'2026-04-09T13:00:00Z'},
  {id:20,title:'Zero-Day Vulnerability in TLS Library',description:'CVE-2026-XXXX affects OpenSSL version used in all production services. CVSS score 9.1.',category:'Cybersecurity',riskScore:9.5,impact:'CRITICAL',likelihood:'HIGH',status:'CRITICAL',mitigationPlan:'Emergency patching cycle initiated. WAF rules deployed as interim mitigation. 24/7 SOC monitoring.',projectedCost:130000,createdAt:'2026-03-28T07:00:00Z',updatedAt:'2026-04-14T06:00:00Z'},
  {id:21,title:'Insurance Premium Escalation',description:'Cyber insurance premiums projected to increase 35% at renewal. Coverage gaps identified in cloud infrastructure.',category:'Financial',riskScore:4.0,impact:'MEDIUM',likelihood:'MEDIUM',status:'OPEN',mitigationPlan:'Broker market review for competitive quotes. Improve security posture to qualify for premium discounts.',projectedCost:275000,createdAt:'2026-03-30T09:00:00Z',updatedAt:'2026-04-07T11:30:00Z'},
  {id:22,title:'Manufacturing Quality Control Deviation',description:'Batch testing revealed 2.1% defect rate exceeding 1.5% threshold. Root cause traced to calibration drift.',category:'Operational',riskScore:5.5,impact:'MEDIUM',likelihood:'MEDIUM',status:'MITIGATED',mitigationPlan:'Implemented daily calibration checks. Deployed statistical process control with automated alerts.',projectedCost:88000,createdAt:'2026-04-01T13:00:00Z',updatedAt:'2026-04-13T10:00:00Z'},
  {id:23,title:'Environmental Reporting Deadline Risk',description:'ESG reporting requirements deadline in 60 days. Data collection from 3 subsidiaries incomplete.',category:'Compliance',riskScore:6.8,impact:'HIGH',likelihood:'MEDIUM',status:'OPEN',mitigationPlan:'Assign dedicated ESG data analyst per subsidiary. Weekly progress reviews with compliance officer.',projectedCost:65000,createdAt:'2026-04-03T08:00:00Z',updatedAt:'2026-04-14T15:00:00Z'},
  {id:24,title:'Digital Transformation ROI Underperformance',description:'Year 1 digital transformation ROI at 12% vs projected 25%. User adoption rates below expectations.',category:'Strategic',riskScore:5.0,impact:'MEDIUM',likelihood:'HIGH',status:'IN_PROGRESS',mitigationPlan:'Launch change management program. Implement gamified training and executive sponsorship roadshow.',projectedCost:450000,createdAt:'2026-04-05T11:00:00Z',updatedAt:'2026-04-12T09:00:00Z'},
  {id:25,title:'CDN Cache Poisoning Vulnerability',description:'Security assessment identified potential cache poisoning vector in CDN configuration. Could serve malicious content.',category:'Cybersecurity',riskScore:7.8,impact:'HIGH',likelihood:'LOW',status:'MITIGATED',mitigationPlan:'Implemented cache key normalization. Added origin verification headers and cache integrity monitoring.',projectedCost:40000,createdAt:'2026-04-07T14:30:00Z',updatedAt:'2026-04-14T12:00:00Z'},
  {id:26,title:'Database Replication Lag Exceeding SLA',description:'Primary-replica lag averaging 4.2 seconds during peak hours. Read-after-write consistency broken for users.',category:'Infrastructure',riskScore:6.5,impact:'MEDIUM',likelihood:'HIGH',status:'OPEN',mitigationPlan:'Upgrade replica instance class. Implement connection routing to primary for critical read paths.',projectedCost:72000,createdAt:'2026-04-08T09:00:00Z',updatedAt:'2026-04-13T16:30:00Z'},
  {id:27,title:'Vendor Lock-in Risk with Cloud Provider',description:'85% of infrastructure on single cloud provider. Migration cost estimated at ₹174M if terms change unfavorably.',category:'Strategic',riskScore:5.2,impact:'HIGH',likelihood:'LOW',status:'OPEN',mitigationPlan:'Adopt multi-cloud strategy for new workloads. Containerize top 10 services for portability.',projectedCost:520000,createdAt:'2026-04-09T10:00:00Z',updatedAt:'2026-04-14T08:00:00Z'},
  {id:28,title:'Customer Data Export Request Backlog',description:'DSAR request queue at 340 pending. Average fulfillment time exceeding 30-day regulatory requirement.',category:'Compliance',riskScore:7.2,impact:'HIGH',likelihood:'HIGH',status:'CRITICAL',mitigationPlan:'Deploy automated DSAR fulfillment tool. Hire 2 temporary data privacy analysts for backlog clearance.',projectedCost:95000,createdAt:'2026-04-10T08:30:00Z',updatedAt:'2026-04-14T14:00:00Z'},
  {id:29,title:'Accounts Receivable Aging Deterioration',description:'AR over 90 days increased from 8% to 14%. Top 5 accounts represent $890K in overdue payments.',category:'Financial',riskScore:6.0,impact:'MEDIUM',likelihood:'MEDIUM',status:'IN_PROGRESS',mitigationPlan:'Implement automated collection escalation workflow. Engage collections agency for accounts over 120 days.',projectedCost:110000,createdAt:'2026-04-12T11:00:00Z',updatedAt:'2026-04-14T10:30:00Z'},
  {id:30,title:'Employee Burnout and Attrition Spike',description:'Engineering team voluntary attrition at 22% annualized. Exit interviews cite workload and lack of growth opportunities.',category:'Operational',riskScore:7.0,impact:'HIGH',likelihood:'HIGH',status:'OPEN',mitigationPlan:'Implement mandatory PTO policy. Launch mentorship program and internal mobility platform.',projectedCost:380000,createdAt:'2026-04-14T09:00:00Z',updatedAt:'2026-04-14T17:00:00Z'},
];

const generateToken = (user) => jwt.sign({ id: user.id, username: user.username, role: user.role, name: user.name }, SECRET_KEY, { expiresIn: '24h' });

const verifyTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try { req.user = jwt.verify(token, SECRET_KEY); next(); }
  catch (error) { return res.status(401).json({ message: 'Invalid token' }); }
};

// Auth
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ token, id: user.id, username: user.username, name: user.name, role: user.role, email: user.email });
});

app.get('/auth/verify', verifyTokenMiddleware, (req, res) => {
  const user = users[req.user.username];
  res.json({ id: user.id, username: user.username, name: user.name, role: user.role, email: user.email });
});

// Risks CRUD
app.get('/api/risks', verifyTokenMiddleware, (req, res) => {
  const { page = 0, size = 10, search, status, category, sortBy, sortDir = 'asc' } = req.query;
  let filtered = [...mockRisks];
  if (search) filtered = filtered.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase()));
  if (status) filtered = filtered.filter(r => r.status === status);
  if (category) filtered = filtered.filter(r => r.category === category);
  if (sortBy) filtered.sort((a, b) => { const av = a[sortBy], bv = b[sortBy]; const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv; return sortDir === 'desc' ? -cmp : cmp; });
  const p = parseInt(page), s = parseInt(size), total = filtered.length;
  res.json({ content: filtered.slice(p * s, (p + 1) * s), pageable: { pageNumber: p, pageSize: s }, totalElements: total, totalPages: Math.ceil(total / s) });
});

app.get('/api/risks/:id', verifyTokenMiddleware, (req, res) => {
  const risk = mockRisks.find(r => r.id === parseInt(req.params.id));
  if (!risk) return res.status(404).json({ message: 'Risk not found' });
  res.json(risk);
});

app.post('/api/risks', verifyTokenMiddleware, (req, res) => {
  const newRisk = { id: mockRisks.length + 1, ...req.body, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  mockRisks.push(newRisk);
  res.status(201).json(newRisk);
});

app.put('/api/risks/:id', verifyTokenMiddleware, (req, res) => {
  const risk = mockRisks.find(r => r.id === parseInt(req.params.id));
  if (!risk) return res.status(404).json({ message: 'Risk not found' });
  Object.assign(risk, req.body, { updatedAt: new Date().toISOString() });
  res.json(risk);
});

app.delete('/api/risks/:id', verifyTokenMiddleware, (req, res) => {
  const idx = mockRisks.findIndex(r => r.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Risk not found' });
  mockRisks.splice(idx, 1);
  res.json({ message: 'Risk deleted' });
});

// Stats
app.get('/api/stats', verifyTokenMiddleware, (req, res) => {
  const statusBreakdown = statuses.map(s => ({ name: s, value: mockRisks.filter(r => r.status === s).length })).filter(s => s.value > 0);
  const categoryBreakdown = cats.map(c => ({ name: c, count: mockRisks.filter(r => r.category === c).length })).filter(c => c.count > 0);
  const monthlyTrend = [
    { month: 'Sep', risks: 8 }, { month: 'Oct', risks: 12 }, { month: 'Nov', risks: 15 },
    { month: 'Dec', risks: 18 }, { month: 'Jan', risks: 22 }, { month: 'Feb', risks: 20 },
    { month: 'Mar', risks: 26 }, { month: 'Apr', risks: 30 },
  ];
  res.json({
    totalRisks: mockRisks.length,
    openRisks: mockRisks.filter(r => r.status === 'OPEN').length,
    criticalRisks: mockRisks.filter(r => r.status === 'CRITICAL').length,
    mitigatedRisks: mockRisks.filter(r => r.status === 'MITIGATED').length,
    inProgressRisks: mockRisks.filter(r => r.status === 'IN_PROGRESS').length,
    closedRisks: mockRisks.filter(r => r.status === 'CLOSED').length,
    avgRiskScore: (mockRisks.reduce((a, r) => a + r.riskScore, 0) / mockRisks.length).toFixed(1),
    totalExposure: mockRisks.reduce((a, r) => a + (r.projectedCost || 0), 0),
    statusBreakdown, categoryBreakdown, monthlyTrend,
  });
});

// CSV Export
app.get('/api/export/csv', verifyTokenMiddleware, (req, res) => {
  const header = 'ID,Title,Category,Risk Score,Impact,Likelihood,Status,Projected Cost,Created\n';
  const rows = mockRisks.map(r => `${r.id},"${r.title}",${r.category},${r.riskScore},${r.impact},${r.likelihood},${r.status},${r.projectedCost},${r.createdAt}`).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=risks_export.csv');
  res.send(header + rows);
});

// AI Mock endpoints
app.post('/api/risks/:id/ai/describe', verifyTokenMiddleware, (req, res) => {
  const risk = mockRisks.find(r => r.id === parseInt(req.params.id));
  if (!risk) return res.status(404).json({ message: 'Risk not found' });
  res.json({ description: `AI Analysis: ${risk.title} presents a ${risk.impact} impact scenario with ${risk.likelihood} probability. The ${risk.category} risk requires immediate attention with a projected exposure of $${(risk.projectedCost/1000).toFixed(0)}K. Current risk score of ${risk.riskScore}/10 suggests ${risk.riskScore >= 7 ? 'critical intervention needed' : 'continued monitoring with periodic reassessment'}.`, generated_at: new Date().toISOString(), meta: { confidence: 0.87, model_used: 'llama-3.3-70b', tokens_used: 245, response_time_ms: 1200, cached: false } });
});

app.post('/api/risks/:id/ai/recommend', verifyTokenMiddleware, (req, res) => {
  const risk = mockRisks.find(r => r.id === parseInt(req.params.id));
  if (!risk) return res.status(404).json({ message: 'Risk not found' });
  res.json({ recommendations: [
    { action_type: 'IMMEDIATE', description: `Establish real-time monitoring for ${risk.category.toLowerCase()} indicators related to this scenario. Set up automated alerts for threshold breaches.`, priority: 'HIGH' },
    { action_type: 'SHORT_TERM', description: `Conduct a cross-functional review of the mitigation plan. Validate projected cost of $${(risk.projectedCost/1000).toFixed(0)}K against industry benchmarks.`, priority: 'MEDIUM' },
    { action_type: 'LONG_TERM', description: `Develop a comprehensive resilience framework addressing ${risk.category.toLowerCase()} risks. Include tabletop exercises and annual review cycles.`, priority: 'LOW' },
  ], meta: { confidence: 0.82, model_used: 'llama-3.3-70b', tokens_used: 380, response_time_ms: 1800, cached: false } });
});

app.post('/api/risks/:id/ai/query', verifyTokenMiddleware, (req, res) => {
  const { question } = req.body;
  const risk = mockRisks.find(r => r.id === parseInt(req.params.id));
  if (!risk) return res.status(404).json({ message: 'Risk not found' });
  res.json({ answer: `Based on the analysis of "${risk.title}": ${question ? `Regarding your question about "${question}" — ` : ''}This ${risk.category} risk with a score of ${risk.riskScore}/10 and ${risk.impact} impact level requires ${risk.riskScore >= 7 ? 'urgent executive attention' : 'standard monitoring procedures'}. The current status is ${risk.status} with an estimated exposure of $${(risk.projectedCost/1000).toFixed(0)}K.`, sources: ['Internal Risk Database', 'Industry Standards Framework', 'Historical Incident Reports'], meta: { confidence: 0.79, model_used: 'llama-3.3-70b', tokens_used: 290, response_time_ms: 1500, cached: false } });
});

// SSE Streaming Report (accepts token via query param since EventSource can't send headers)
app.get('/api/reports/stream', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try { req.user = jwt.verify(token, SECRET_KEY); }
  catch (error) { return res.status(401).json({ message: 'Invalid token' }); }
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  const chunks = [
    '# Risk Assessment Executive Report\n\n',
    '## Executive Summary\n\n',
    'This report provides a comprehensive analysis of the current risk landscape ',
    'across all operational domains. Our AI-powered assessment has identified ',
    `${mockRisks.length} active risk scenarios spanning ${cats.length} categories.\n\n`,
    '## Key Findings\n\n',
    `- **Total Risk Scenarios**: ${mockRisks.length}\n`,
    `- **Critical Alerts**: ${mockRisks.filter(r=>r.status==='CRITICAL').length}\n`,
    `- **Open Risks**: ${mockRisks.filter(r=>r.status==='OPEN').length}\n`,
    `- **Average Risk Score**: ${(mockRisks.reduce((a,r)=>a+r.riskScore,0)/mockRisks.length).toFixed(1)}/10\n\n`,
    '## Top Priority Risks\n\n',
    ...mockRisks.filter(r=>r.riskScore>=8).map(r=>`- **${r.title}** (Score: ${r.riskScore}) — ${r.category}\n`),
    '\n## Recommendations\n\n',
    '1. Immediate escalation of all CRITICAL status items to executive committee\n',
    '2. Allocate emergency budget for cybersecurity remediation efforts\n',
    '3. Schedule quarterly risk review cadence with cross-functional stakeholders\n',
    '4. Implement automated risk scoring pipeline with real-time dashboards\n\n',
    '---\n*Report generated by RISK.SIM AI Engine | Powered by LLaMA 3.3 70B*',
  ];
  let i = 0;
  const interval = setInterval(() => {
    if (i < chunks.length) { res.write(`data: ${JSON.stringify({ token: chunks[i] })}\n\n`); i++; }
    else { res.write('data: [DONE]\n\n'); clearInterval(interval); res.end(); }
  }, 150);
  req.on('close', () => clearInterval(interval));
});

app.listen(PORT, () => {
  console.log(`🚀 Mock Backend running on http://localhost:${PORT}`);
  console.log(`\n📝 Credentials: admin/admin123 | manager/manager123 | viewer/viewer123\n`);
});
