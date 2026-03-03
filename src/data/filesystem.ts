/* ─── Virtual File System ─── */

export interface FSNode {
    type: 'file' | 'dir';
    content?: string;
    protected?: boolean; // requires sudo
    hardware?: string;   // triggers focusComponent() on cat
    children?: Record<string, FSNode>;
}

export const FILE_SYSTEM: FSNode = {
    type: 'dir',
    children: {
        etc: {
            type: 'dir',
            children: {
                'network.conf': {
                    type: 'file',
                    content: `# ─── network.conf ───
# Series.so Cloud Infrastructure Mapping

[core]
frontend_nodes = vercel_edge_network
backend_cluster = gcp_compute_engine
db_cluster = supabase_postgresql_v15

[services]
api_gateway = fastapi_async_workers
inference_engine = gemini_pro_vision
event_stream = kafka_broker_pool

[routing]
health_check = /api/v1/health
latency_target = <50ms
failover_region = us-west2`,
                },
            },
        },
        bin: {
            type: 'dir',
            children: {
                'contact.sh': {
                    type: 'file',
                    content: `#!/bin/bash
# ─── contact.sh ───
# Aarush Inamdar — Contact Information

echo "Email:    aarushinamdar@gmail.com"
echo "LinkedIn: linkedin.com/in/aarush-inamdar"
echo "GitHub:   github.com/AarushInamdar"
echo "Location: Irvine, CA"
echo ""
echo "# Run this script to establish a connection."`,
                },
                'resume.pdf': {
                    type: 'file',
                    content: `╔══════════════════════════════════════════════╗
║           AARUSH INAMDAR — RÉSUMÉ            ║
╠══════════════════════════════════════════════╣
║                                              ║
║  EDUCATION                                   ║
║  ─────────                                   ║
║  UC Irvine — B.S. Computer Science           ║
║            — B.A. Business Administration    ║
║                                              ║
║  EXPERIENCE                                  ║
║  ──────────                                  ║
║  Adobe         — Software Engineer           ║
║  Apple         — Software Engineer           ║
║  Series.so     — Software Engineer           ║
║  TRL11         — Software Engineer           ║
║  SAP SE        — Software & QA Engineer      ║
║                                              ║
║  Run 'man <company>' for full details.       ║
╚══════════════════════════════════════════════╝`,
                },
                clear: {
                    type: 'file',
                    content: '[SYSTEM] Clears the terminal screen.',
                },
                help: {
                    type: 'file',
                    content: '[SYSTEM] Displays available commands. Use "man <topic>" for detailed manual pages.',
                },
            },
        },

        mnt: {
            type: 'dir',
            children: {
                hardware: {
                    type: 'dir',
                    children: {
                        'trl11.sys': {
                            type: 'file',
                            hardware: 'pmu',
                            content: `╔══════════════════════════════════════════════╗
║  DEVICE: PMU UTILITY — TRL11 Systems        ║
╠══════════════════════════════════════════════╣
║                                              ║
║  Role: Software Engineer                     ║
║  Stack: C++ · SQLite · Python · Bash         ║
║                                              ║
║  > Engineered PMU data collection scripts    ║
║    processing 10K+ data points per session   ║
║                                              ║
║  > Developed SQLite database schemas for     ║
║    high-frequency sensor telemetry           ║
║                                              ║
║  > Built automated validation pipelines      ║
║    reducing manual QA effort by 60%          ║
║                                              ║
║  > Created performance monitoring utilities  ║
║    for power management firmware             ║
║                                              ║
║  STATUS: MOUNTED ── /dev/pmu0                ║
╚══════════════════════════════════════════════╝`,
                        },
                        'sap.sys': {
                            type: 'file',
                            hardware: 'sap',
                            content: `╔══════════════════════════════════════════════╗
║  DEVICE: ENTERPRISE BRIDGE — SAP SE          ║
╠══════════════════════════════════════════════╣
║                                              ║
║  Role: Software Engineer                     ║
║  Stack: ABAP · JavaScript · Cypress.js       ║
║                                              ║
║  > Developed ABAP backend modules for SAP    ║
║    enterprise resource planning systems      ║
║                                              ║
║  > Built Cypress.js E2E test suites          ║
║    achieving 95%+ code coverage              ║
║                                              ║
║  > Integrated JavaScript frontends with      ║
║    SAP Fiori design system                   ║
║                                              ║
║  > Collaborated on cross-functional teams    ║
║    spanning 3 global offices                 ║
║                                              ║
║  STATUS: MOUNTED ── /dev/ent0                ║
╚══════════════════════════════════════════════╝`,
                        },
                    },
                },
            },
        },

        home: {
            type: 'dir',
            children: {
                projects: {
                    type: 'dir',
                    children: {
                        CheckSplit: {
                            type: 'dir',
                            children: {
                                'README.md': {
                                    type: 'file',
                                    content: `# CheckSplit
## Intelligent Bill-Splitting iOS Application

**Stack:** SwiftUI · CoreML · Vision · CoreData

CheckSplit uses on-device ML to parse restaurant receipts,
extract line items, and intelligently split bills among
dining companions.

### Key Features
- OCR-powered receipt scanning via Apple Vision framework
- CoreML line-item classification with 94% accuracy
- Real-time split calculations with tip customization
- SwiftUI native interface with haptic feedback
- Offline-first architecture using CoreData persistence

### Architecture
\`\`\`
┌─────────────┐   ┌──────────────┐   ┌────────────┐
│  Vision OCR  │──▶│  CoreML      │──▶│  SwiftUI   │
│  Pipeline    │   │  Classifier  │   │  Views     │
└─────────────┘   └──────────────┘   └────────────┘
\`\`\`

> Accepted into UC Irvine ANTrepreneur Center incubator.`,
                                },
                            },
                        },
                        NetAudit: {
                            type: 'dir',
                            children: {
                                'README.md': {
                                    type: 'file',
                                    content: `# NetAudit
## Web Accessibility Compliance Auditor

**Stack:** Next.js · TypeScript · Go · SQLite

NetAudit is a comprehensive web accessibility auditing tool
that scans websites for WCAG 2.1 AA/AAA compliance violations.

### Key Features
- Automated WCAG 2.1 compliance scanning
- Real-time accessibility score dashboards
- PDF report generation with remediation steps
- Priority queue for critical violations
- Audit history with tagging system

### Architecture
\`\`\`
┌──────────┐   ┌──────────┐   ┌──────────┐
│  Next.js  │──▶│  Go API   │──▶│  SQLite  │
│  Frontend │   │  Backend  │   │  Store   │
└──────────┘   └──────────┘   └──────────┘
\`\`\`

> Full-stack production application with CI/CD pipeline.`,
                                },
                            },
                        },
                        SPOTS: {
                            type: 'dir',
                            children: {
                                'README.md': {
                                    type: 'file',
                                    content: `# SPOTS
## Smart Parking Optimization & Tracking System

**Stack:** React Native · Node.js · MongoDB · IoT

SPOTS is a smart parking solution that uses IoT sensors
and real-time data to optimize parking space utilization.

### Key Features
- Real-time parking availability via IoT sensors
- Predictive occupancy models using historical data
- Mobile-first React Native interface
- Admin dashboard with analytics
- Integration with campus parking infrastructure

### Architecture
\`\`\`
┌──────────┐   ┌──────────┐   ┌──────────┐
│  IoT Hub  │──▶│  Node.js  │──▶│  MongoDB │
│  Sensors  │   │  API      │   │  Atlas   │
└──────────┘   └──────────┘   └──────────┘
        └───────────▶ React Native App
\`\`\`

> Designed for UC Irvine campus deployment.`,
                                },
                            },
                        },
                    },
                },
                'ai-engine': {
                    type: 'dir',
                    children: {
                        'config.json': {
                            type: 'file',
                            content: `{
  "ai_infrastructure": {
    "version": "2.4.1",
    "status": "active",
    "endpoints": {
      "inference": "https://api.series.so/v1/infer",
      "embeddings": "https://api.series.so/v1/embed"
    },
    "models": {
      "llm": "google-gemini-pro",
      "vision": "apple-coreml-v4",
      "vector_dim": 768
    },
    "projects": [
      {
        "name": "CheckSplit",
        "stack": ["CoreML", "Vision", "SwiftUI"],
        "accuracy": 0.94
      },
      {
        "name": "Series.so",
        "stack": ["FastAPI", "Gemini API", "LangChain"],
        "retrieval_accuracy": 0.92
      }
    ]
  }
}`,
                        },
                    },
                },
            },
        },

        var: {
            type: 'dir',
            children: {
                logs: {
                    type: 'dir',
                    children: {
                        'academic.log': {
                            type: 'file',
                            protected: true,
                            content: `[SECURE] /var/logs/academic.log — REQUIRES ELEVATED ACCESS
═══════════════════════════════════════════════
ACADEMIC TRANSCRIPT — UC IRVINE (2021–2025)
═══════════════════════════════════════════════

[2021-09] ENROLLED — Donald Bren School of ICS
          B.S. Computer Science
          B.A. Business Administration (Dual Degree)

[2021-12] COMPLETED — ICS 31, 32, 33 (Python Series)
          Dean's Honor List — Fall 2021

[2022-06] COMPLETED — ICS 45C (C++), ICS 46 (Data Structures)
          Dean's Honor List — Spring 2022

[2022-09] STARTED  — Alpha Kappa Psi Professional Fraternity
          VP of Technology

[2023-03] COMPLETED — CS 141 (Compilers), CS 143A (Operating Systems)
          Dean's Honor List — Winter 2023

[2023-06] INTERNSHIP — SAP SE (Summer 2023)

[2024-01] INTERNSHIP — TRL11 Systems (Winter 2024)

[2024-06] INTERNSHIP — Apple Inc. (Summer 2024)

[2024-09] SELECTED  — ANTrepreneur Center (CheckSplit)

[2025-01] POSITION  — Series.so (Founding Engineer)

[2025-03] POSITION  — Adobe (Software Engineer)

═══════════════════════════════════════════════
STATUS: ACTIVE  |  GPA: CLASSIFIED [sudo required]
═══════════════════════════════════════════════`,
                        },
                        'system.log': {
                            type: 'file',
                            content: `[2025-03-02 13:00:01] kernel: System boot initiated
[2025-03-02 13:00:02] kernel: Loading hardware modules...
[2025-03-02 13:00:03] pmu0: TRL11 PMU Utility mounted at /dev/pmu0
[2025-03-02 13:00:03] ent0: SAP Enterprise Bridge mounted at /dev/ent0
[2025-03-02 13:00:04] gpu0: Apple UI Engine initialized
[2025-03-02 13:00:04] cpu0: Adobe C++ Core online (TRL11 optimized)
[2025-03-02 13:00:05] mem0: CS module loaded (4096 MB)
[2025-03-02 13:00:05] mem1: BizAdmin module loaded (2048 MB)
[2025-03-02 13:00:05] mem2: SwiftUI module loaded (4096 MB)
[2025-03-02 13:00:06] net0: Series.so Neural Engine connected
[2025-03-02 13:00:07] kernel: All modules online. System ready.
[2025-03-02 13:00:07] kernel: Welcome, Aarush.`,
                        },
                    },
                },
            },
        },
    },
};

/* ─── Man Pages ─── */
export const MAN_PAGES: Record<string, string> = {
    ls: `LS(1)                    Kernel Manual                    LS(1)

NAME
    ls — list directory contents

SYNOPSIS
    ls [path]

DESCRIPTION
    List information about files and directories in the
    current directory, or in the specified path.

EXAMPLES
    ls              List current directory
    ls /home        List /home directory
    ls /mnt/hardware List hardware devices`,

    cd: `CD(1)                    Kernel Manual                    CD(1)

NAME
    cd — change directory

SYNOPSIS
    cd [path]

DESCRIPTION
    Change the current working directory to the specified
    path. Use '..' to navigate to the parent directory.
    Use '/' prefix for absolute paths.

EXAMPLES
    cd home          Relative navigation
    cd /mnt/hardware Absolute navigation
    cd ..            Go up one level`,

    cat: `CAT(1)                   Kernel Manual                    CAT(1)

NAME
    cat — display file contents

SYNOPSIS
    cat <file>

DESCRIPTION
    Read and display the contents of the specified file.
    Supports both relative and absolute paths.

    Hardware files (.sys) trigger 3D scene interaction.
    Protected files require sudo elevation.

EXAMPLES
    cat resume.pdf              Display resume
    cat /home/projects/NetAudit/README.md
    sudo cat /var/logs/academic.log`,

    man: `MAN(1)                   Kernel Manual                    MAN(1)

NAME
    man — display manual pages

SYNOPSIS
    man <command|topic>

DESCRIPTION
    Display the manual page for the given command or topic.
    Topics include commands (ls, cd, cat) and experience
    modules (adobe, apple, series, checksplit, netaudit).

AVAILABLE PAGES
    Commands:  ls, cd, cat, man, pwd, clear, sudo, help, ping, ask-gemini
    Modules:   adobe, apple, series, trl11, sap
    Projects:  checksplit, netaudit, spots`,

    'ask-gemini': `ASK-GEMINI(1)            Kernel Manual            ASK-GEMINI(1)

NAME
    ask-gemini — query the Neural Engine

SYNOPSIS
    ask-gemini <query>

DESCRIPTION
    Sends a natural language query to the embedded AI assistant
    powered by Google's Gemini API. The assistant has deep
    knowledge of Aarush's experience, projects, skills, and
    hobbies.

    Off-topic questions will be politely rejected.

EXAMPLES
    ask-gemini What did Aarush do at Adobe?
    ask-gemini Tell me about CheckSplit.
    ask-gemini What are some of his hobbies?`,

    ping: `PING(1)                  Kernel Manual                  PING(1)

NAME
    ping — check network connectivity to a skill

SYNOPSIS
    ping <skill>

DESCRIPTION
    Sends ICMP ECHO_REQUEST packets to network hosts.
    In this VFS, it acts as a skills verifier. Pinging a
    valid skill will return mock network stats referencing
    associated projects or companies.

EXAMPLES
    ping swift
    ping c++
    ping python`,

    sudo: `SUDO(1)                  Kernel Manual                    SUDO(1)

NAME
    sudo — execute command as superuser

SYNOPSIS
    sudo <command>

DESCRIPTION
    Execute the given command with elevated privileges.
    Required for accessing protected system files in /var/.
    You will be prompted for authentication.

EXAMPLES
    sudo cat /var/logs/academic.log`,

    pwd: `PWD(1)                   Kernel Manual                    PWD(1)

NAME
    pwd — print working directory

SYNOPSIS
    pwd

DESCRIPTION
    Print the absolute path of the current working directory.`,

    clear: `CLEAR(1)                 Kernel Manual                    CLEAR(1)

NAME
    clear — clear terminal screen

SYNOPSIS
    clear

DESCRIPTION
    Clears all output from the terminal display.`,

    help: `HELP(1)                  Kernel Manual                    HELP(1)

NAME
    help — list available commands

SYNOPSIS
    help

DESCRIPTION
    Display a list of all available shell commands.
    Use 'man <command>' for detailed documentation.`,

    adobe: `ADOBE(7)              Experience Module              ADOBE(7)

NAME
    Adobe — Software Engineer

DESCRIPTION
    High-performance graphics engineering role focused on
    C++ systems within Adobe's creative product suite.

RESPONSIBILITIES
    • Engineered C++ rendering pipeline optimizations,
      achieving 40% latency reduction in frame processing

    • Developed memory-efficient data structures for
      real-time image manipulation at scale

    • Collaborated with cross-functional teams on
      performance profiling and bottleneck analysis

    • Implemented automated regression test suites
      for rendering accuracy validation

STACK
    C++ (TRL11) · Performance Profiling · Graphics Pipeline
    Memory Optimization · Automated Testing

SEE ALSO
    cat /mnt/hardware/trl11.sys`,

    apple: `APPLE(7)              Experience Module              APPLE(7)

NAME
    Apple — Software Engineer

DESCRIPTION
    Mobile development role building geofencing and
    location-aware features using SwiftUI and CoreLocation.

RESPONSIBILITIES
    • Architected geofencing module using CoreLocation
      framework with configurable boundary regions

    • Built SwiftUI interfaces adhering to Apple Human
      Interface Guidelines with fluid animations

    • Developed offline-capable data sync layer using
      CoreData with conflict resolution strategies

    • Implemented comprehensive XCTest suites with
      95%+ code coverage on critical paths

STACK
    SwiftUI · CoreLocation · CoreData · XCTest
    MapKit · Combine · Accessibility (VoiceOver)

SEE ALSO
    man checksplit`,

    series: `SERIES(7)             Experience Module             SERIES(7)

NAME
    Series.so — Founding Engineer

DESCRIPTION
    Full-stack AI engineering role building RAG pipelines
    and intelligent document processing systems.

RESPONSIBILITIES
    • Designed and implemented RAG pipeline achieving
      92% retrieval accuracy on domain-specific queries

    • Built FastAPI backend with async processing for
      high-throughput document ingestion

    • Integrated Google Gemini API for intelligent
      summarization and question-answering

    • Deployed containerized services with automated
      CI/CD via GitHub Actions

STACK
    Python · FastAPI · Google Gemini · LangChain
    PostgreSQL · Docker · GitHub Actions

SEE ALSO
    man netaudit`,

    trl11: `TRL11(7)              Experience Module              TRL11(7)

NAME
    TRL11 — Software Engineer (PMU Systems)

DESCRIPTION
    Low-level systems engineering role focused on power
    management unit (PMU) data collection and analysis.

RESPONSIBILITIES
    • Engineered PMU data collection scripts processing
      10,000+ data points per session

    • Developed SQLite database schemas optimized for
      high-frequency sensor telemetry storage

    • Built automated validation pipelines reducing
      manual QA effort by 60%

    • Created performance monitoring utilities for
      power management firmware debugging

STACK
    C++ · SQLite · Python · Bash · PMU Telemetry

SEE ALSO
    cat /mnt/hardware/trl11.sys`,

    sap: `SAP(7)                Experience Module                SAP(7)

NAME
    SAP SE — Software Engineer

DESCRIPTION
    Enterprise software development role building ABAP
    backend modules and JavaScript test automation.

RESPONSIBILITIES
    • Developed ABAP backend modules for SAP enterprise
      resource planning (ERP) systems

    • Built Cypress.js end-to-end test suites achieving
      95%+ code coverage across critical workflows

    • Integrated JavaScript frontends with SAP Fiori
      design system for enterprise UX

    • Collaborated across 3 global offices on
      cross-functional feature delivery

STACK
    ABAP · JavaScript · Cypress.js · SAP Fiori · ERP

SEE ALSO
    cat /mnt/hardware/sap.sys`,

    checksplit: `CHECKSPLIT(7)         Project Manual            CHECKSPLIT(7)

NAME
    CheckSplit — Intelligent Bill-Splitting iOS App

SYNOPSIS
    A SwiftUI application using CoreML and Vision to parse
    restaurant receipts and split bills intelligently.

DESCRIPTION
    CheckSplit leverages Apple's on-device ML frameworks
    to perform OCR on restaurant receipts, classify line
    items, and compute fair splits among companions.

ARCHITECTURE
    ┌─────────────┐   ┌──────────────┐   ┌────────────┐
    │  Vision OCR  │──▶│  CoreML      │──▶│  SwiftUI   │
    │  Pipeline    │   │  Classifier  │   │  Views     │
    └─────────────┘   └──────────────┘   └────────────┘

FEATURES
    • OCR receipt scanning (Apple Vision framework)
    • CoreML line-item classification — 94% accuracy
    • Real-time split calculations with tip customization
    • Offline-first via CoreData persistence
    • Haptic feedback and fluid SwiftUI animations

RECOGNITION
    Accepted into UC Irvine ANTrepreneur Center incubator.

SEE ALSO
    cat /home/projects/CheckSplit/README.md`,

    netaudit: `NETAUDIT(7)           Project Manual             NETAUDIT(7)

NAME
    NetAudit — Web Accessibility Compliance Auditor

SYNOPSIS
    A full-stack application for automated WCAG 2.1
    accessibility auditing with PDF report generation.

DESCRIPTION
    NetAudit scans websites for accessibility violations,
    scores compliance against WCAG 2.1 AA/AAA standards,
    and generates detailed remediation reports.

ARCHITECTURE
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │  Next.js  │──▶│  Go API   │──▶│  SQLite  │
    │  Frontend │   │  Backend  │   │  Store   │
    └──────────┘   └──────────┘   └──────────┘

FEATURES
    • Automated WCAG 2.1 compliance scanning
    • Real-time accessibility score dashboards
    • PDF report generation with remediation steps
    • Priority queue for critical violations
    • Audit history with tagging and filtering

STACK
    Next.js · TypeScript · Go · SQLite · PDF Generation

SEE ALSO
    cat /home/projects/NetAudit/README.md`,

    spots: `SPOTS(7)              Project Manual               SPOTS(7)

NAME
    SPOTS — Smart Parking Optimization & Tracking System

SYNOPSIS
    An IoT-powered smart parking solution with real-time
    availability tracking and predictive occupancy models.

DESCRIPTION
    SPOTS uses IoT sensors to monitor parking space
    utilization in real-time, providing predictive models
    and a mobile interface for drivers.

ARCHITECTURE
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │  IoT Hub  │──▶│  Node.js  │──▶│  MongoDB │
    │  Sensors  │   │  API      │   │  Atlas   │
    └──────────┘   └──────────┘   └──────────┘
            └───────────▶ React Native App

STACK
    React Native · Node.js · MongoDB · IoT Sensors

SEE ALSO
    cat /home/projects/SPOTS/README.md`,
};

/* ─── Helper: resolve a path in the VFS ─── */
export function resolvePath(
    cwd: string,
    target: string
): { absolutePath: string; node: FSNode | null } {
    // Normalize to absolute path
    let parts: string[];
    if (target.startsWith('/')) {
        parts = target.split('/').filter(Boolean);
    } else {
        parts = [...cwd.split('/').filter(Boolean), ...target.split('/').filter(Boolean)];
    }

    // Resolve '..' and '.'
    const resolved: string[] = [];
    for (const part of parts) {
        if (part === '..') resolved.pop();
        else if (part !== '.') resolved.push(part);
    }

    // Walk the tree
    let node: FSNode = FILE_SYSTEM;
    for (const part of resolved) {
        if (node.type !== 'dir' || !node.children || !(part in node.children)) {
            return { absolutePath: '/' + resolved.join('/'), node: null };
        }
        node = node.children[part];
    }

    return { absolutePath: '/' + resolved.join('/'), node };
}
