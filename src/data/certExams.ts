import type { CertExam } from "./types";

const engineerExam: CertExam = {
  slug: "engineer",
  trackSlug: "engineer",
  title: "Elastic Certified Engineer",
  description:
    "Task-based simulation mirroring the Elastic Certified Engineer exam format. You are given access to a running Elasticsearch cluster (localhost:9200) and must solve hands-on tasks by planning and writing the correct API requests. No documentation is provided; partial credit applies.",
  durationMinutes: 45,
  passingScore: 70,
  questions: [
    {
      id: "ece-1",
      scenario:
        "Your team ingests product catalogs into Elasticsearch. Before indexing any document, the search team asks you to create an index named `catalog` that is safe for a single-node development cluster: exactly 1 primary shard and 0 replicas.",
      contextCode: {
        title: "Dev Tools request draft",
        lang: "json",
        code: `PUT /catalog\n{\n  ???\n}`,
      },
      prompt:
        "Which request body correctly completes the task above and prevents the cluster health from turning yellow on a single node?",
      options: [
        `{ "settings": { "number_of_shards": 1, "number_of_replicas": 0 } }`,
        `{ "settings": { "number_of_shards": 0, "number_of_replicas": 1 } }`,
        `{ "mappings": { "number_of_shards": 1, "number_of_replicas": 0 } }`,
        `{ "settings": { "index.shards": 1, "index.replicas": 0 } }`,
      ],
      answerIndex: 0,
      explanation:
        "Index settings number_of_shards and number_of_replicas belong under \"settings\". One primary shard with zero replicas keeps the cluster green on a single node, because there are no unassigned replica shards.",
    },
    {
      id: "ece-2",
      scenario:
        "Documents containing personal email addresses are accidentally indexed into the `orders` index. Legal asks you to remove every order where the field `customer.email` equals the leaked address. The index is live and must not be deleted or recreated.",
      prompt:
        "Which approach removes exactly the matching documents while keeping the index available for reads and writes?",
      options: [
        "Run POST /orders/_delete_by_query with a term query on customer.email.keyword.",
        "Run DELETE /orders and re-create the index with the same mappings.",
        "Run POST /orders/_update_by_query with a script that sets customer.email to null.",
        "Run PUT /orders/_settings with \"index.blocks.write\": true to block new writes.",
      ],
      answerIndex: 0,
      explanation:
        "_delete_by_query deletes the documents matching a query without removing the index. A term query on the keyword sub-field gives an exact match. _update_by_query only modifies documents, and deleting the index violates the requirement.",
    },
    {
      id: "ece-3",
      scenario:
        "An index named `logs-2024` currently has the following mappings:\n\n\"message\": { \"type\": \"text\" }\n\nThe logging team now needs to run aggregations on `message` to find the most frequent full log lines. You cannot reindex into a new index in this step.",
      prompt:
        "What is the correct way to enable aggregations on full log lines without reindexing?",
      options: [
        "Add a multi-field: update the mapping with a `keyword` sub-field (e.g. message.keyword) using PUT /logs-2024/_mapping.",
        "Change the type of `message` from text to keyword directly in the existing mapping.",
        "Run POST /logs-2024/_close, edit the mapping, then POST /logs-2024/_open.",
        "Use a terms aggregation directly on the text field; Elasticsearch enables it automatically.",
      ],
      answerIndex: 0,
      explanation:
        "The type of an existing field cannot be changed, but you can add new fields — including keyword multi-fields — via the PUT mapping API. Aggregations then target message.keyword. Changing the type in place is rejected; text fields do not support terms aggregations by default (fielddata is disabled).",
    },
    {
      id: "ece-4",
      scenario:
        "A search request against `products` should find documents whose `description` mentions \"wireless mouse\", but the analyst only remembers the phrase approximately and wants fuzzy tolerance of up to 2 edits.",
      contextCode: {
        title: "Current query (returns nothing useful)",
        lang: "json",
        code: `GET /products/_search\n{\n  "query": {\n    "match": {\n      "description": "wireless mouse"\n    }\n  }\n}`,
      },
      prompt:
        "Which modification to the match query adds fuzziness with a maximum of 2 edits?",
      options: [
        `"match": { "description": { "query": "wireless mouse", "fuzziness": 2 } }`,
        `"match": { "description": "wireless mouse~2" }`,
        `"match": { "description": { "query": "wireless mouse", "fuzzy": true } }`,
        `"match_phrase": { "description": { "query": "wireless mouse", "fuzziness": 2 } }`,
      ],
      answerIndex: 0,
      explanation:
        "The match query supports a fuzziness parameter when written in the long form. \"wireless mouse~2\" is fuzzy query syntax, not match syntax; match_phrase does not support fuzziness.",
    },
    {
      id: "ece-5",
      scenario:
        "The cluster `GET _cluster/health` reports status yellow after you created the index `events` with 1 primary shard and 2 replicas on a two-node cluster. All primaries are assigned.",
      prompt:
        "What is the most likely cause, and which action turns the cluster green without changing primary shard count?",
      options: [
        "One replica cannot be assigned because replicas and their primary cannot share a node; reduce number_of_replicas to 1 with PUT /events/_settings.",
        "The primary shard is corrupt; delete the index and restore from snapshot.",
        "The cluster needs a third node; there is no settings-based fix.",
        "Run POST /events/_forcemerge?max_num_segments=1 to reduce the number of segments.",
      ],
      answerIndex: 0,
      explanation:
        "A replica of a shard is never allocated on the same node as its primary. With 2 nodes and 2 replicas, one replica stays unassigned, causing yellow status. Lowering number_of_replicas to 1 (a dynamic setting) resolves it. _forcemerge does not affect allocation.",
    },
    {
      id: "ece-6",
      scenario:
        "For capacity planning you must protect the 7-day-old `metrics-daily` indices from accidental deletion, and you also need a single name, `metrics-all`, that always queries every daily index at once.",
      prompt:
        "Which combination of API calls accomplishes both requirements?",
      options: [
        "PUT /metrics-daily/_settings with \"index.blocks.write\": true, then POST /_aliases adding alias metrics-all to metrics-daily.",
        "PUT /metrics-daily/_alias/metrics-all, then DELETE /metrics-daily/_alias/metrics-old.",
        "POST /metrics-daily/_close, then PUT /metrics-all/_settings pointing to the closed indices.",
        "Create an index template named metrics-all; templates act as aliases automatically.",
      ],
      answerIndex: 0,
      explanation:
        "index.blocks.write is a dynamic setting that prevents writes (including deletes of documents) while keeping the index searchable, and the _aliases API creates an alias spanning many indices. Index templates do not create aliases for existing indices, and closed indices cannot be searched.",
    },
    {
      id: "ece-7",
      scenario:
        "You need an aggregation over the `sales` index that shows, for each `region`, the average `price` of documents sold in 2024 only.",
      prompt:
        "Which request body returns the average price per region restricted to documents from 2024?",
      options: [
        `A query with a range filter on "date": {"gte": "2024-01-01", "lt": "2025-01-01"} plus a terms aggregation on region with a nested avg aggregation on price.`,
        `A terms aggregation on region with a nested avg aggregation on price, and a post_filter on date.`,
        `A date_histogram aggregation on date with calendar_interval year, plus a nested avg on price.`,
        `A filter aggregation on the year 2024 with a nested terms aggregation on region.`,
      ],
      answerIndex: 0,
      explanation:
        "The query section restricts the document set before aggregation, so a range query on date scoped to 2024 combined with a terms agg on region and a nested avg agg on price is the canonical solution. post_filter applies after aggregations are computed; a date_histogram groups by time buckets instead of filtering first.",
    },
    {
      id: "ece-8",
      scenario:
        "During a rolling upgrade, node `es-node-2` must be drained safely: no shards may be allocated to it, but existing shards should relocate to other nodes rather than be dropped.",
      prompt:
        "Which cluster setting drains the node in a safe, persistent way?",
      options: [
        `PUT _cluster/settings with "transient": { "cluster.routing.allocation.exclude._name": "es-node-2" }`,
        `PUT _cluster/settings with "persistent": { "cluster.routing.allocation.enable": "none" }`,
        `POST /es-node-2/_shutdown followed immediately by stopping the process.`,
        `PUT _cluster/settings with "persistent": { "cluster.routing.rebalance.enable": "none" }`,
      ],
      answerIndex: 0,
      explanation:
        "cluster.routing.allocation.exclude._name moves shards off the named node as capacity allows, which is the standard drain procedure. Disabling allocation cluster-wide (enable: none) freezes all shard movement; disabling rebalancing does not stop new allocations to the node.",
    },
    {
      id: "ece-9",
      scenario:
        "An e-commerce index `products` maps `category` as text. Analysts need a terms aggregation showing the top 10 categories, but the aggregation fails because fielddata is disabled on text fields.",
      prompt:
        "What is the correct long-term fix that keeps full-text search on `category` working?",
      options: [
        "Add a keyword multi-field (category.keyword) via PUT /products/_mapping and aggregate on it.",
        "Set \"fielddata\": true on the existing text field to allow aggregations in memory.",
        "Change the field type to keyword with PUT /products/_mapping.",
        "Run the aggregation with \"size\": 0 so fielddata is not needed.",
      ],
      answerIndex: 0,
      explanation:
        "The standard pattern is text with a keyword sub-field: text for search, keyword for aggregations and sorting. Enabling fielddata consumes large amounts of heap; changing an existing field's type is rejected by Elasticsearch.",
    },
    {
      id: "ece-10",
      scenario:
        "You must reindex 50 million documents from `logs-old` into `logs-new` with a new mapping. The operation may take hours, and the client connection must not need to stay open.",
      prompt:
        "Which approach runs the reindex reliably in the background and lets you monitor progress?",
      options: [
        "POST /_reindex?wait_for_completion=false, then poll GET /_tasks/<task_id> for status.",
        "POST /logs-old/_search with scroll in a loop from a single HTTP client.",
        "PUT /logs-new/_settings with \"index.auto_expand_replicas\": \"0-all\".",
        "POST /_snapshot/restore of logs-old into logs-new with renamed settings.",
      ],
      answerIndex: 0,
      explanation:
        "wait_for_completion=false makes the reindex run as a background task whose progress is visible through the Task Management API. Scroll-based client reindexing requires a long-lived client loop; snapshots do not apply new mappings.",
    },
    {
      id: "ece-11",
      scenario:
        "A search for \"quick brown fox\" must rank documents containing the exact phrase higher than documents containing the words separately, but both kinds must match.",
      prompt:
        "Which query structure achieves this ranking behavior?",
      options: [
        "A bool query with a match query on the field in must, plus a match_phrase query on the same field in should.",
        "A single term query on each word combined with minimum_should_match: 3.",
        "A match_all query with a rescore window on relevance.",
        "A prefix query on the first word only.",
      ],
      answerIndex: 0,
      explanation:
        "The match clause guarantees recall (any word matches), while the match_phrase in should boosts documents where the words appear in order. term queries do not analyze text, and match_all does not differentiate ranking.",
    },
    {
      id: "ece-12",
      scenario:
        "After enabling security, a new read-only user must be able to search the `reports-*` indices but must not view or modify any other data.",
      prompt:
        "What is the correct way to grant this access?",
      options: [
        "Create a role with indices privileges [\"read\", \"view_index_metadata\"] on reports-* and assign it to the user.",
        "Give the user the built-in superuser role but ask them not to modify anything.",
        "Set \"xpack.security.enabled\": false so no roles are needed.",
        "Create an API key with the kibana_user role for the user.",
      ],
      answerIndex: 0,
      explanation:
        "Elasticsearch security uses roles with index-level privileges; read plus view_index_metadata on the reports-* pattern is the minimal, correct grant. superuser grants everything; kibana_user is for Kibana access, not index search.",
    },
  ],
};

const observabilityExam: CertExam = {
  slug: "observability",
  trackSlug: "observability",
  title: "Elastic Certified Observability Engineer",
  description:
    "Task-based simulation mirroring the Elastic Certified Observability Engineer exam. You operate a live Elastic Stack (Elasticsearch, Kibana, Fleet-managed Elastic Agent, APM Server) and must complete hands-on observability tasks. Partial credit applies; the official documentation is available in the real exam.",
  durationMinutes: 45,
  passingScore: 70,
  questions: [
    {
      id: "ecoe-1",
      scenario:
        "Your company runs a Kubernetes cluster and must start shipping container logs and node metrics into Elastic within one hour, with minimal manual configuration on each host.",
      prompt:
        "Which approach is the recommended way to achieve this with the least manual setup?",
      options: [
        "Deploy Elastic Agent managed by Fleet as a DaemonSet with the Kubernetes integration.",
        "Install Filebeat and Metricbeat manually on every node with hand-written YAML.",
        "Enable the logging driver of the container runtime to write JSON files and ingest them later.",
        "Configure each application to POST logs directly to the Elasticsearch _bulk API.",
      ],
      answerIndex: 0,
      explanation:
        "Fleet-managed Elastic Agent deployed as a DaemonSet is the recommended, centrally managed way to collect Kubernetes logs and metrics. Manual Beats installs and ad-hoc bulk ingestion do not scale and are harder to govern.",
    },
    {
      id: "ecoe-2",
      scenario:
        "APM data for the service `checkout` shows latency spikes every night at 02:00. You need to find the slowest individual transactions during the spike to see which database call is responsible.",
      prompt:
        "In the Kibana APM app, which view shows individual transactions with their spans and waterfall timing?",
      options: [
        "The Transactions view for the service, then selecting a trace sample to open the trace waterfall.",
        "The Service Map, which animates slow dependencies.",
        "The Dependencies tab, listing downstream services by throughput.",
        "The Anomalies feed from the machine learning integration.",
      ],
      answerIndex: 0,
      explanation:
        "The Transactions view lists transaction samples for a time range; opening a sample reveals the trace waterfall with spans, letting you pinpoint the slow database call. Service Map and Dependencies show topology, not individual traces.",
    },
    {
      id: "ecoe-3",
      scenario:
        "SREs complain that the alerting rule \"CPU above 90%\" pages them dozens of times per night because usage briefly spikes during cron jobs. The rule should only fire when CPU stays above 90% for a sustained period.",
      prompt:
        "Which change to the rule configuration best reduces this noise while still catching real incidents?",
      options: [
        "Increase the rule's \"for the last\" time window so the condition must hold over several minutes before firing.",
        "Lower the threshold from 90% to 50% so fewer events qualify.",
        "Set the rule check interval to every 10 seconds so spikes are detected faster.",
        "Switch the rule type from a metric threshold rule to an anomaly detection rule.",
      ],
      answerIndex: 0,
      explanation:
        "Metric threshold rules evaluate the condition over a configurable time window; requiring the threshold to hold for several minutes filters out transient spikes. Lowering the threshold increases noise; a shorter check interval does not smooth transient spikes.",
    },
    {
      id: "ecoe-4",
      scenario:
        "A new microservice `payments` written in Go must report distributed traces that connect end-to-end with the existing Node.js `frontend` service, so a single user request appears as one trace across both services.",
      prompt:
        "What is required to achieve end-to-end distributed tracing across the two services?",
      options: [
        "Instrument both services with Elastic APM agents pointed at the same APM Server, and propagate the traceparent header between them.",
        "Install Metricbeat on both hosts and enable the http module.",
        "Create an index pattern named traces-apm-* in Kibana.",
        "Enable cross-cluster search between the two services' clusters.",
      ],
      answerIndex: 0,
      explanation:
        "Distributed tracing requires APM instrumentation on each hop plus propagation of the W3C traceparent header so spans share one trace ID. Metricbeat collects metrics, not traces; index patterns and CCS do not create trace correlation.",
    },
    {
      id: "ecoe-5",
      scenario:
        "The logs of the `api` service are ingested, but the `message` field is a single raw JSON string. You must extract `level`, `user.id`, and `latency_ms` so they can be filtered and aggregated in Kibana.",
      prompt:
        "Where should this parsing happen so the fields are searchable for both new and existing data going forward?",
      options: [
        "In an ingest pipeline attached to the data stream, using the JSON processor followed by a rename or set of processors.",
        "With a runtime field defined in the Kibana data view applied to every query.",
        "By editing the agent's processors to drop the message field entirely.",
        "By retraining the machine learning model used for log categorization.",
      ],
      answerIndex: 0,
      explanation:
        "An ingest pipeline with the JSON processor parses the raw message into structured fields at ingest time, which is the standard Elastic approach and applies to all newly indexed data. Runtime fields help at query time but do not index fields for efficient filtering and aggregation.",
    },
    {
      id: "ecoe-6",
      scenario:
        "Leadership wants a single Kibana dashboard showing: (1) error rate of the `checkout` service over time, (2) the top 5 hosts by CPU usage, and (3) the count of log messages containing \"timeout\" — all filtered by one shared time picker.",
      prompt:
        "Which Kibana feature builds this dashboard with visualizations drawn from APM, metrics, and logs data?",
      options: [
        "Lens, adding layers that query the traces-apm, metrics-*, and logs-* data views on one dashboard.",
        "Canvas, because only workpads support multiple data sources.",
        "Timelion, with one expression per panel.",
        "Stack Monitoring, customizing the default overview.",
      ],
      answerIndex: 0,
      explanation:
        "Lens is Kibana's primary visualization builder and can create panels over different data views (APM traces, metrics, logs) that coexist on one dashboard governed by a shared time picker. Canvas is presentation-oriented; Timelion is time-series math; Stack Monitoring monitors the Elastic Stack itself.",
    },
    {
      id: "ecoe-7",
      scenario:
        "An SLO must be defined for the `search` service: 99.9% of requests over a rolling 30-day window must complete in under 300 ms. Stakeholders want to see the error budget burn rate in Kibana.",
      prompt:
        "Which capability implements this requirement natively?",
      options: [
        "Kibana SLOs with a latency SLI (transaction duration threshold) and a rolling time window.",
        "A Watcher alert that pages when the p99 exceeds 300 ms.",
        "A Canvas workpad with a manually drawn gauge.",
        "An ingest pipeline that drops documents slower than 300 ms.",
      ],
      answerIndex: 0,
      explanation:
        "Kibana SLOs support latency-based service level indicators over APM data, rolling windows, and error budget/burn-rate visualizations. Watcher alerts fire on conditions but do not model SLOs or error budgets.",
    },
    {
      id: "ecoe-8",
      scenario:
        "After enabling Fleet, the `web-01` host appears as Healthy in the Agents list, but no metrics arrive. `elastic-agent status` shows the system integration output as failing with authentication errors against Elasticsearch.",
      prompt:
        "What is the most likely root cause and the correct fix?",
      options: [
        "The output's API key or enrollment credentials are invalid; re-enroll the agent with a valid enrollment token or fix the output credentials in Fleet settings.",
        "The host clock is wrong; synchronize it with NTP and metrics will appear.",
        "The data view metrics-* is missing; create it manually in Kibana.",
        "The cluster is in read-only mode; run PUT _all/_settings to remove index.blocks.read_only.",
      ],
      answerIndex: 0,
      explanation:
        "Authentication errors from the agent output mean the credentials used to write to Elasticsearch are invalid. Re-enrolling the agent (or correcting the output in Fleet) issues valid credentials. NTP, data views, and read-only blocks would not produce authentication errors.",
    },
    {
      id: "ecoe-9",
      scenario:
        "Log volume from the `firewall` integration grows to 2 TB/day and hot nodes fill up. Data older than 7 days is rarely queried but must remain searchable for compliance for 90 days.",
      prompt:
        "Which configuration meets the requirement at the lowest cost?",
      options: [
        "Attach an ILM policy to the data stream: hot phase for 7 days, then warm/cold phases (optionally searchable snapshots on cheaper storage) with delete after 90 days.",
        "Manually delete indices older than 7 days with a cron job.",
        "Set \"index.number_of_replicas\": 3 so data is safer.",
        "Export all logs to CSV nightly and delete the indices.",
      ],
      answerIndex: 0,
      explanation:
        "ILM automates the hot→warm→cold→delete lifecycle, keeping recent data fast on hot nodes and older data searchable on cheaper tiers until the retention limit. Manual deletion risks errors and violates the 90-day requirement.",
    },
    {
      id: "ecoe-10",
      scenario:
        "Two teams share one Elasticsearch cluster. Team A's logs must be invisible to Team B in Kibana, and each team needs its own dashboards and alerting rules.",
      prompt:
        "Which combination provides this separation?",
      options: [
        "Separate Kibana spaces per team plus document-level/index-level security roles granting each team only its own indices.",
        "One shared space with dashboard names prefixed by team name.",
        "Two browsers with different saved searches.",
        "A Canvas workpad with a password field on each page.",
      ],
      answerIndex: 0,
      explanation:
        "Spaces separate Kibana objects (dashboards, rules), while Elasticsearch security roles restrict which indices each team can read. Naming conventions and browser tricks provide no actual access control.",
    },
    {
      id: "ecoe-11",
      scenario:
        "The APM UI shows the `orders` service calling PostgreSQL, but every database span is named only \"SELECT\" — you cannot tell which queries are slow.",
      prompt:
        "How do you get more descriptive span names for database calls?",
      options: [
        "Ensure the agent's instrumentation captures the statement (span name includes the table/operation), or add custom spans with descriptive names via the agent API.",
        "Rename the index traces-apm-* to something longer.",
        "Increase the transaction sample rate to 1.0.",
        "Enable fielddata on the span.name field.",
      ],
      answerIndex: 0,
      explanation:
        "Agent auto-instrumentation derives span names from the DB statement when available; otherwise custom instrumentation via the agent API lets developers name spans meaningfully. Sampling rate affects volume, not naming; fielddata is unrelated.",
    },
    {
      id: "ecoe-12",
      scenario:
        "An alert on \"error log rate\" fires every time a deployment happens because error logs briefly surge during rolling restarts. Deployments are published as annotations/events with the field `event.dataset : \"deployments\"`.",
      prompt:
        "What is the most practical way to reduce these false positives without losing real incidents?",
      options: [
        "Adjust the rule to exclude or delay evaluation around deployment windows (e.g., a filter excluding known deployment periods or a longer evaluation window), and keep monitoring error budget burn separately.",
        "Disable the alert rule permanently.",
        "Delete all error logs during deployments.",
        "Raise the threshold so high that it never fires.",
      ],
      answerIndex: 0,
      explanation:
        "Correlating alert evaluation with known change events (or smoothing with a longer window) suppresses expected deployment noise while preserving detection of genuine surges. Disabling or over-raising thresholds creates blind spots.",
    },
  ],
};

const detectionExam: CertExam = {
  slug: "detection",
  trackSlug: "detection",
  title: "Elastic Security for SIEM",
  description:
    "Task-based simulation mirroring the Elastic Security for SIEM exam/curriculum. You work inside a Kibana space with Elastic Security enabled and must complete hands-on detection engineering tasks: building rules, tuning, hunting, and investigating alerts. Partial credit applies.",
  durationMinutes: 45,
  passingScore: 70,
  questions: [
    {
      id: "ecde-1",
      scenario:
        "Threat intel reports that the ransomware family \"BlackBit\" executes `rundll32.exe` with a command line containing `\\AppData\\Local\\Temp`. You must create a detection that fires only when rundll32 is launched with a temp-directory path in its arguments.",
      prompt:
        "Which KQL query for a custom query detection rule matches this behavior precisely?",
      options: [
        `process.name : "rundll32.exe" and process.command_line : "*\\\\AppData\\\\Local\\\\Temp*"`,
        `process.name : "*rundll32*" or process.command_line : "*Temp*"`,
        `event.category : "process" and host.name : "*temp*"`,
        `file.path : "*\\\\AppData\\\\Local\\\\Temp*"`,
      ],
      answerIndex: 0,
      explanation:
        "Combining the exact process name with a wildcard match on the command line (with escaped backslashes) captures the behavior precisely. OR-based or file-path-only queries create massive false positives or miss the execution event entirely.",
    },
    {
      id: "ecde-2",
      scenario:
        "Your new rule \"Suspicious PowerShell Download Cradle\" fires 400 times per day, mostly from the IT admin workstations `IT-ADMIN-*` running approved maintenance scripts. The rule is otherwise valuable on user workstations.",
      prompt:
        "What is the best tuning action to reduce noise while keeping the rule effective?",
      options: [
        "Add a rule exception excluding host.name : \"IT-ADMIN-*\" for this rule.",
        "Disable the rule entirely and rely on manual hunting instead.",
        "Lower the rule severity from high to low so analysts ignore it.",
        "Increase the rule schedule interval from 5 minutes to 24 hours.",
      ],
      answerIndex: 0,
      explanation:
        "Rule exceptions suppress alerts for known-benign conditions while the rule keeps firing everywhere else. Disabling loses coverage; lowering severity only hides the noise; a longer interval delays detection without reducing volume.",
    },
    {
      id: "ecde-3",
      scenario:
        "You want to detect a brute-force pattern: more than 10 failed logins (`event.outcome : \"failure\"`) from the same `source.ip` against any host within 5 minutes. Individual failures are too common to alert on one by one.",
      prompt:
        "Which rule type detects this aggregated behavior?",
      options: [
        "A threshold rule grouping by source.ip with a count of failed-login events >= 10 over the rule interval.",
        "A custom query rule matching a single failed-login event.",
        "A machine learning rule with the rare-URL detector.",
        "An indicator match rule against a threat intelligence feed.",
      ],
      answerIndex: 0,
      explanation:
        "Threshold rules aggregate events by a field (source.ip) and alert when the cardinality or count crosses a threshold in the configured window — exactly the brute-force pattern. Single-event rules cannot express the count, and ML/indicator rules target different problems.",
    },
    {
      id: "ecde-4",
      scenario:
        "An alert shows `winword.exe` spawning `powershell.exe`, which then spawns `rundll32.exe` loading an unsigned DLL from a user's Downloads folder. You must understand the full execution chain and which other alerts relate to the same attack.",
      prompt:
        "Which Elastic Security feature visualizes this process ancestry and correlates related alerts?",
      options: [
        "The Analyzer (session/process analyzer) opened from the alert details, showing the process tree and related events.",
        "The Hosts page KPI charts, filtering by the host name.",
        "The Detection rules monitoring tab, sorting by last run.",
        "A Lens pie chart of process.name over the last 24 hours.",
      ],
      answerIndex: 0,
      explanation:
        "The Analyzer renders the process tree around an alert — ancestors, descendants, and related alerts/events — which is exactly what an investigation of a multi-stage execution chain requires. KPI charts and rule monitoring do not show process ancestry.",
    },
    {
      id: "ecde-5",
      scenario:
        "A threat feed publishes hashes of malicious installer files daily. You need alerts whenever any endpoint in your fleet executes a file whose SHA-256 appears in that feed.",
      prompt:
        "Which detection rule type is designed for this use case?",
      options: [
        "An indicator match rule joining file.hash.sha256 events against the threat intelligence indicator index.",
        "A new terms rule watching for unseen file names.",
        "An event correlation (EQL) rule with a sequence of two file events.",
        "A machine learning rule using the high-count-by-destination detector.",
      ],
      answerIndex: 0,
      explanation:
        "Indicator match rules are built for correlating your telemetry with threat-intelligence indicators (hashes, IPs, domains) and generate alerts enriched with the matched indicator. New terms detects novelty, not matches against a feed; EQL sequences express temporal behavior, not feed lookups.",
    },
    {
      id: "ecde-6",
      scenario:
        "During a hunt, you hypothesize that an attacker used `net.exe` to enumerate domain groups after compromising a workstation. You need to find any occurrence in the last 30 days across all endpoints before writing a detection.",
      prompt:
        "What is the most efficient hunting workflow in Elastic Security?",
      options: [
        "Open the Timeline/Explore data with a KQL query such as process.name : \"net.exe\" and process.args : (\"group\" and \"/domain\") over 30 days, then pivot interesting results into a new rule.",
        "Export all endpoint logs to CSV and grep them locally.",
        "Create a detection rule first, wait 30 days, and read its alerts.",
        "Enable every prebuilt rule and check which ones fire.",
      ],
      answerIndex: 0,
      explanation:
        "Hunting starts with ad-hoc KQL queries over historical data (Explore views or Timeline), then validated findings are converted into detection rules. Exporting CSV does not scale, and creating a rule first cannot look back at existing data.",
    },
    {
      id: "ecde-7",
      scenario:
        "Your team enables the prebuilt rule \"Potential LSASS Memory Dump via Comsvcs DLL\". It never fires during a purple-team exercise even though the technique was executed, and the rule's Last Response shows \"succeeded\".",
      prompt:
        "What is the most likely reason the rule produced no alerts?",
      options: [
        "The required data source (e.g., Sysmon/Endpoint process or API events for lsass access) is not being ingested into an index matched by the rule's index patterns.",
        "The rule severity is set to low, which suppresses alerts by default.",
        "The rule is older than the data, so it ignores new events.",
        "The rule exceptions list contains a wildcard entry for all hosts by default.",
      ],
      answerIndex: 0,
      explanation:
        "A rule that runs successfully but never matches almost always lacks the required telemetry: the rule queries indices (e.g., logs-endpoint.events.* or winlogbeat-*) that contain no relevant lsass-access events. Severity never suppresses alerts, and prebuilt rules ship without wildcard exceptions.",
    },
    {
      id: "ecde-8",
      scenario:
        "Management requires that every alert generated by the critical rule set also appears in the SOC's external case management system within 5 minutes, with the alert status synchronized back to Elastic when analysts close cases there.",
      prompt:
        "Which Elastic Security capability fulfills this requirement?",
      options: [
        "Connectors and Cases: attach a case action (e.g., ServiceNow/Jira) to the rules so alerts create external cases, with bidirectional status sync where supported.",
        "A Watcher webhook that POSTs raw alert JSON to the SIEM.",
        "The Reporting feature, exporting a daily PDF of open alerts.",
        "Cross-cluster replication of the .alerts index to the case system.",
      ],
      answerIndex: 0,
      explanation:
        "Elastic Security Cases integrate with external systems (ServiceNow, Jira, IBM Resilient, etc.) via connectors; rule actions can push alerts automatically and supported connectors sync case status back. Watcher, PDF reports, and replication do not provide case lifecycle synchronization.",
    },
    {
      id: "ecde-9",
      scenario:
        "A detection rule must fire only when a rare sequence occurs: a user logs in from a new country, then within 10 minutes accesses a database they have never accessed before.",
      prompt:
        "Which rule type best expresses this multi-step, time-ordered pattern?",
      options: [
        "An event correlation (EQL) rule using a sequence with a maxspan of 10 minutes.",
        "A simple custom query rule matching either event.",
        "A threshold rule counting logins per user.",
        "A new terms rule on the country field alone.",
      ],
      answerIndex: 0,
      explanation:
        "EQL sequences express ordered, correlated events within a time window (maxspan) — exactly the multi-step pattern required. Single-event and threshold rules cannot model order and timing between distinct events.",
    },
    {
      id: "ecde-10",
      scenario:
        "Your SOC receives indicators of compromise (IOCs) as STIX/TAXII feeds and wants them automatically usable by indicator match rules in Elastic Security.",
      prompt:
        "What is the supported way to get these indicators into Elasticsearch?",
      options: [
        "Install the Threat Intelligence integration (e.g., AbuseIPDB, MISP, ThreatQuotient, or the TAXII module) via an Elastic Agent policy so indicators are written to the ti_* data streams.",
        "Paste the IOC list into a Kibana dashboard markdown panel.",
        "Store the feeds in a Google Sheet and refresh it weekly.",
        "Enable the geoip ingest processor with default settings.",
      ],
      answerIndex: 0,
      explanation:
        "Elastic's Threat Intelligence integrations (including TAXII) continuously pull feeds into the ti_* data streams, which indicator match rules query natively. Manual copies are stale and unstructured; geoip enriches IPs but is not a threat feed.",
    },
    {
      id: "ecde-11",
      scenario:
        "An analyst suspects credential dumping on endpoint `WS-447`. You want a timeline that automatically filters all events to that host and lets you save KQL queries for reuse by the whole team.",
      prompt:
        "Which Elastic Security feature provides this?",
      options: [
        "Timelines with saved timeline templates, filtered by host.name : \"WS-447\".",
        "The Stack Management index patterns page.",
        "The APM service inventory.",
        "A Lens gauge visualization exported to PDF.",
      ],
      answerIndex: 0,
      explanation:
        "Timelines are the investigation workspace: they persist queries/filters, and templates let the team start new investigations with pre-built queries. Index patterns, APM inventory, and PDF exports are not collaborative investigation workspaces.",
    },
    {
      id: "ecde-12",
      scenario:
        "A prebuilt rule is too noisy in your environment. Before editing anything, your manager asks you to make sure the original rule stays intact so future content updates from Elastic can still apply cleanly.",
      prompt:
        "What is the correct approach to customize the rule safely?",
      options: [
        "Duplicate the prebuilt rule, then modify and enable the duplicate while leaving the original disabled/unchanged.",
        "Edit the prebuilt rule in place; Elastic updates always merge your changes.",
        "Delete the prebuilt rule to stop update conflicts.",
        "Export the rule to NDJSON and never import it again.",
      ],
      answerIndex: 0,
      explanation:
        "Duplicating creates a custom copy you own; the immutable prebuilt original remains eligible for upstream updates. Editing prebuilt rules directly complicates updates, and deleting loses the reference implementation.",
    },
  ],
};

export const certExams: CertExam[] = [engineerExam, observabilityExam, detectionExam];

export function getCertExam(trackSlug: string): CertExam | undefined {
  return certExams.find((e) => e.trackSlug === trackSlug);
}
