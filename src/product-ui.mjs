// assuregraph product page: a mock of the app, in the same dark window as the demos, with four tabs.
// Everything is HTML and CSS (no images). Values are illustrative, like the demo traces. Tabs are switched by
// site.js ([data-tabs]); without JS all four panels are shown stacked.

const chip = (kind, text) => `<span class="app-chip app-chip--${kind}">${text}</span>`;

const runs = `
<div class="app-kpis" aria-label="This week">
<div class="app-kpi"><span class="app-kpi__label">Change failure rate</span><strong>4.1%</strong></div>
<div class="app-kpi"><span class="app-kpi__label">Mean time to recovery</span><strong>38 min</strong></div>
<div class="app-kpi"><span class="app-kpi__label">Time to green</span><strong>11 min</strong></div>
<div class="app-kpi"><span class="app-kpi__label">Flaky reruns</span><strong>6</strong></div>
<div class="app-kpi"><span class="app-kpi__label">Suite acceptance</span><strong>91%</strong></div>
</div>
<table class="app-table">
<thead><tr><th>Run</th><th>Trigger</th><th>Tests</th><th>Result</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td>5128</td><td>PR #482 · refund cap</td><td>3 generated</td><td>3 pass</td><td>${chip('pass', 'PR opened')}</td></tr>
<tr><td>5127</td><td>nightly</td><td>2,418</td><td>2,415 pass · 3 fail</td><td>${chip('pass', '2 flaky quarantined · 1 ticket')}</td></tr>
<tr><td>5126</td><td>PR #480 · login lockout</td><td>4 generated</td><td>3 pass · 1 fail</td><td>${chip('fail', 'held · regression')}</td></tr>
<tr><td>5125</td><td>spec PAY-77</td><td>2 generated</td><td>pending code</td><td>${chip('pending', 'ahead of the code')}</td></tr>
<tr><td>5124</td><td>PR #479 · search index</td><td>6 maintained</td><td>6 pass</td><td>${chip('pass', 'merged')}</td></tr>
</tbody>
</table>`;

const trace = `
<div class="app-trace">
<div class="app-trace__chain" aria-label="Lineage for requirement REQ-311">
<div class="app-node"><span class="app-node__kind">Requirement</span><strong>REQ-311</strong><span>Cumulative refund cap</span></div>
<div class="app-node"><span class="app-node__kind">Change</span><strong>PR #482</strong><span>refunds.py · 3 lines</span></div>
<div class="app-node"><span class="app-node__kind">Tests</span><strong>3</strong><span>unit · placed by policy</span></div>
<div class="app-node"><span class="app-node__kind">Run</span><strong>5128</strong><span>3 of 3 pass · 2.4 s</span></div>
<div class="app-node app-node--end"><span class="app-node__kind">Evidence</span><strong>Signed</strong><span>judge ok · reviewed by a person</span></div>
</div>
<table class="app-table app-table--compact">
<thead><tr><th>Requirement</th><th>Tests</th><th>Last run</th><th>Evidence</th></tr></thead>
<tbody>
<tr><td>REQ-311 · Cumulative refund cap</td><td>3</td><td>5128 · pass</td><td>${chip('pass', 'complete')}</td></tr>
<tr><td>REQ-298 · Login lockout after 5 tries</td><td>4</td><td>5126 · 1 fail</td><td>${chip('fail', 'regression held')}</td></tr>
<tr><td>PAY-77 · 30-day refund window</td><td>2</td><td>pending</td><td>${chip('pending', 'awaiting code')}</td></tr>
<tr><td>REQ-240 · Search index rebuild</td><td>6</td><td>5124 · pass</td><td>${chip('pass', 'complete')}</td></tr>
</tbody>
</table>
</div>`;

const bar = (pct) => `<span class="app-bar" aria-hidden="true"><span style="width:${pct}%"></span></span>`;
const coverage = `
<table class="app-table">
<thead><tr><th>Path</th><th>Production traffic</th><th>Tests</th><th>Priority</th></tr></thead>
<tbody>
<tr><td>checkout / refund</td><td>${bar(92)} high</td><td>${bar(100)} 11</td><td>${chip('pass', 'covered')}</td></tr>
<tr><td>auth / lockout</td><td>${bar(74)} high</td><td>${bar(45)} 4</td><td>${chip('fail', 'generate 3 tests')}</td></tr>
<tr><td>search / index</td><td>${bar(58)} medium</td><td>${bar(80)} 6</td><td>${chip('pass', 'covered')}</td></tr>
<tr><td>billing / invoice export</td><td>${bar(31)} low</td><td>${bar(20)} 1</td><td>${chip('pending', 'low priority')}</td></tr>
<tr><td>profile / avatar upload</td><td>${bar(12)} low</td><td>${bar(0)} 0</td><td>${chip('pending', 'watch')}</td></tr>
</tbody>
</table>
<p class="app-note">Ranked by how often production hits the path against how much of it has tests. UI tests are only proposed where a lower level cannot prove the behaviour.</p>`;

const setup = `
<div class="app-setup">
<div class="app-setup__col">
<div class="app-setup__h">Sources</div>
<ul class="app-list">
<li><span>GitHub</span>${chip('pass', 'connected · read')}</li>
<li><span>Jira</span>${chip('pass', 'connected · read')}</li>
<li><span>CI</span>${chip('pass', 'GitHub Actions · read')}</li>
<li><span>Logs</span>${chip('pending', 'choose a source')}</li>
<li><span>Designs</span>${chip('pending', 'optional')}</li>
</ul>
<div class="app-setup__h">Your model</div>
<ul class="app-list">
<li><span>Endpoint</span>${chip('pass', 'your tenant · in VPC')}</li>
<li><span>Approved models</span><span class="app-list__val">small · mid · large</span></li>
<li><span>Output</span><span class="app-list__val">pull requests only</span></li>
</ul>
</div>
<div class="app-setup__col">
<div class="app-setup__h">Policy</div>
<pre class="app-code" aria-label="Policy file">route:
  accuracy: ≥ 0.95
  latency:  ≤ 2 s
  cost:     prefer lowest
  data:     no customer data to external
placement:
  levels: [unit, api, ui]
  prefer: lowest that proves it
review:
  human: refunds, auth, payments</pre>
</div>
</div>`;

const tabs = [
  ['runs', 'Runs', runs],
  ['traceability', 'Traceability', trace],
  ['coverage', 'Coverage', coverage],
  ['setup', 'Setup', setup],
];

export const productUi = () => `<div class="app" data-tabs>
<div class="demo__bar app__bar"><span class="demo__dots" aria-hidden="true"><i></i><i></i><i></i></span>
<div class="app__tabs" role="tablist" aria-label="Product views">
${tabs.map(([id, t], i) => `<button class="app__tab" role="tab" id="tab-${id}" aria-controls="panel-${id}" aria-selected="${i === 0}" type="button">${t}</button>`).join('\n')}
</div></div>
${tabs.map(([id, t, body], i) => `<section class="app__panel" role="tabpanel" id="panel-${id}" aria-labelledby="tab-${id}"${i === 0 ? '' : ' hidden'}>
<h3 class="visually-hidden">${t}</h3>${body}
</section>`).join('\n')}
</div>`;
