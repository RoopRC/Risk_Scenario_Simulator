import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getRisks, getStats } from '../services/api';

const COLORS = { primary: [16, 185, 129], dark: [5, 10, 21], accent: [6, 182, 212], danger: [239, 68, 68], amber: [245, 158, 11], purple: [168, 85, 247] };

const addHeader = (doc, title, subtitle) => {
  doc.setFillColor(...COLORS.dark);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 38, 210, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, 14, 30);
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 196, 30, { align: 'right' });
};

const addFooter = (doc, pageNum, totalPages) => {
  doc.setFillColor(...COLORS.dark);
  doc.rect(0, 282, 210, 15, 'F');
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.text('Risk Scenario Simulator — Confidential', 14, 290);
  doc.text(`Page ${pageNum} of ${totalPages}`, 196, 290, { align: 'right' });
};

export const generateComplianceAuditPDF = async () => {
  const [risksData, stats] = await Promise.all([getRisks({ page: 0, size: 100 }), getStats()]);
  const risks = risksData.content || [];
  const doc = new jsPDF();

  addHeader(doc, 'Compliance Audit Report', 'Risk Classification & Mitigation Adherence');

  // Summary Section
  let y = 50;
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive Summary', 14, y);
  y += 8;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const totalRisks = stats.totalRisks || 0;
  const critical = stats.criticalRisks || 0;
  const mitigated = risks.filter(r => r.status === 'MITIGATED').length;
  const closed = risks.filter(r => r.status === 'CLOSED').length;
  const complianceRate = totalRisks > 0 ? (((mitigated + closed) / totalRisks) * 100).toFixed(1) : 0;

  const summaryLines = [
    `Total Risk Scenarios Assessed: ${totalRisks}`,
    `Critical Priority Items: ${critical}`,
    `Mitigated / Closed: ${mitigated + closed}`,
    `Compliance Adherence Rate: ${complianceRate}%`,
    `Average Risk Score: ${stats.avgRiskScore || 'N/A'}/10`,
    `Total Financial Exposure: Rs. ${((stats.totalExposure || 0) / 100000).toFixed(1)}L`,
  ];
  summaryLines.forEach(line => { doc.text(line, 18, y); y += 6; });

  // Compliance Status Table
  y += 6;
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Risk Classification Matrix', 14, y);
  y += 4;

  const tableData = risks.map(r => [
    `#${r.id}`, r.title?.substring(0, 30) || 'N/A', r.category || 'N/A',
    r.status || 'N/A', `${r.riskScore || 0}/10`, r.impact || 'N/A',
    r.status === 'MITIGATED' || r.status === 'CLOSED' ? 'Compliant' : 'Non-Compliant'
  ]);

  autoTable(doc, {
    startY: y,
    head: [['ID', 'Title', 'Category', 'Status', 'Score', 'Impact', 'Compliance']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: COLORS.primary, textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7, textColor: [50, 50, 50] },
    alternateRowStyles: { fillColor: [240, 248, 245] },
    columnStyles: { 6: { fontStyle: 'bold' } },
    didParseCell: (data) => {
      if (data.column.index === 6 && data.section === 'body') {
        data.cell.styles.textColor = data.cell.raw === 'Compliant' ? [16, 185, 129] : [239, 68, 68];
      }
    },
  });

  // Recommendations
  const finalY = doc.lastAutoTable.finalY + 10;
  if (finalY < 250) {
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Audit Recommendations', 14, finalY);
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const recs = [
      `• ${critical} critical risk(s) require immediate remediation within 30 days.`,
      `• Current compliance rate is ${complianceRate}%. Target: 95% by next quarter.`,
      '• Implement automated risk scoring to reduce manual assessment overhead.',
      '• Schedule bi-weekly compliance review meetings for high-priority items.',
    ];
    recs.forEach((r, i) => doc.text(r, 18, finalY + 8 + i * 6));
  }

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) { doc.setPage(i); addFooter(doc, i, totalPages); }

  doc.save(`compliance_audit_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateTrendAnalysisPDF = async () => {
  const [risksData, stats] = await Promise.all([getRisks({ page: 0, size: 100 }), getStats()]);
  const risks = risksData.content || [];
  const doc = new jsPDF();

  addHeader(doc, 'Trend Analysis Report', 'Historical Data & Predictive Risk Modeling');

  let y = 50;
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Risk Distribution Overview', 14, y);
  y += 8;

  // Status breakdown
  const statusCounts = {};
  risks.forEach(r => { statusCounts[r.status] = (statusCounts[r.status] || 0) + 1; });
  const statusData = Object.entries(statusCounts).map(([status, count]) => [
    status, String(count), `${((count / (risks.length || 1)) * 100).toFixed(1)}%`
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Status', 'Count', 'Percentage']],
    body: statusData,
    theme: 'grid',
    headStyles: { fillColor: COLORS.accent, textColor: [255, 255, 255], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    tableWidth: 100,
  });

  // Category breakdown
  y = doc.lastAutoTable.finalY + 10;
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Category Analysis', 14, y);
  y += 4;

  const catCounts = {};
  const catScores = {};
  risks.forEach(r => {
    const cat = r.category || 'Unknown';
    catCounts[cat] = (catCounts[cat] || 0) + 1;
    catScores[cat] = (catScores[cat] || 0) + (r.riskScore || 0);
  });
  const catData = Object.entries(catCounts).map(([cat, count]) => [
    cat, String(count), (catScores[cat] / count).toFixed(1) + '/10',
    count >= 3 ? 'High Volume' : 'Normal'
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Category', 'Scenarios', 'Avg Score', 'Volume Flag']],
    body: catData,
    theme: 'grid',
    headStyles: { fillColor: COLORS.purple, textColor: [255, 255, 255], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
  });

  // Top risks
  y = doc.lastAutoTable.finalY + 10;
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Highest Risk Scenarios', 14, y);
  y += 4;

  const topRisks = [...risks].sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0)).slice(0, 10);
  const topData = topRisks.map(r => [
    `#${r.id}`, r.title?.substring(0, 35) || 'N/A', `${r.riskScore || 0}/10`,
    r.impact || 'N/A', r.likelihood || 'N/A', `Rs. ${((r.projectedCost || 0) / 100000).toFixed(1)}L`
  ]);

  autoTable(doc, {
    startY: y,
    head: [['ID', 'Title', 'Score', 'Impact', 'Likelihood', 'Projected Cost']],
    body: topData,
    theme: 'grid',
    headStyles: { fillColor: COLORS.danger, textColor: [255, 255, 255], fontSize: 8 },
    bodyStyles: { fontSize: 8 },
  });

  // Predictive insights
  const insightY = doc.lastAutoTable.finalY + 10;
  if (insightY < 250) {
    doc.setTextColor(16, 185, 129);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('4. Predictive Insights', 14, insightY);
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const insights = [
      `• Average risk score: ${stats.avgRiskScore || 'N/A'}/10 — trending ${(stats.avgRiskScore || 0) > 6 ? 'above' : 'within'} acceptable thresholds.`,
      `• ${statusCounts['CRITICAL'] || 0} critical scenarios flagged for immediate attention.`,
      `• ${statusCounts['OPEN'] || 0} open scenarios pending initial assessment.`,
      `• Financial exposure totals Rs. ${((stats.totalExposure || 0) / 100000).toFixed(1)}L across all active scenarios.`,
      '• Recommend quarterly reassessment cycle for all HIGH/CRITICAL items.',
    ];
    insights.forEach((ins, i) => doc.text(ins, 18, insightY + 8 + i * 6));
  }

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) { doc.setPage(i); addFooter(doc, i, totalPages); }

  doc.save(`trend_analysis_${new Date().toISOString().split('T')[0]}.pdf`);
};
