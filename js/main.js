// Heaven on Earth Foundation - Main JavaScript
// Core functionality for institutional prospectus

console.log('main.js loaded successfully');

const totalSteps = 8;
let track, btnReset;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    track = document.getElementById('timelineTrack');
    btnReset = document.getElementById('btnReset');
    console.log('track:', track);
    console.log('btnReset:', btnReset);
});

// Navigation function for Reader Guide links
function navigateToStep(targetStep) {
    const targetRow = document.getElementById(`step-${targetStep}`);
    if (!targetRow) {
        console.error(`Step ${targetStep} not found!`);
        return;
    }

    // Close the navigation accordion
    const navAccordion = document.querySelector('.prospectus-header .faq-item');
    if (navAccordion) {
        const navBtn = navAccordion.querySelector('.faq-q');
        const navContent = navAccordion.querySelector('.faq-a');
        if (navBtn && navContent) {
            navBtn.setAttribute('aria-expanded', 'false');
            navContent.style.display = 'none';
        }
    }

    // Reveal target section
    targetRow.setAttribute('aria-hidden', 'false');
    targetRow.classList.add('is-revealed');

    // Calculate and extend track height
    const containerTop = document.getElementById('main-content').getBoundingClientRect().top;
    const dot = targetRow.querySelector('.timeline-dot');
    const dotTop = dot ? dot.getBoundingClientRect().top : targetRow.getBoundingClientRect().top + 60;
    const targetHeight = (dotTop - containerTop) + 5;
    
    track.style.transition = 'height 0.6s ease';
    track.style.height = `${targetHeight}px`;

    // Smooth scroll to section after reveal
    setTimeout(() => {
        const targetHeading = targetRow.querySelector('h3, h2');
        if (targetHeading) targetHeading.focus({preventScroll: true});
        
        const y = targetRow.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({top: y, behavior: 'smooth'});

        // Show reset button if at last step
        if (targetStep === totalSteps) {
            if (btnReset) btnReset.classList.add('is-visible');
        }
    }, 300);
}

function advanceTimeline(nextStep, clickedBtn) {
    const nextRow = document.getElementById(`step-${nextStep}`);
    if (!nextRow) {
        console.error(`Step ${nextStep} not found!`);
        return;
    }

    // Add transitioning class to prevent FAQ scroll conflicts
    document.body.classList.add('timeline-transitioning');

    // Hide the button that was clicked
    if (clickedBtn) {
        clickedBtn.style.opacity = '0';
        setTimeout(() => { clickedBtn.style.display = 'none'; }, 300);
    }

    const containerTop = document.getElementById('main-content').getBoundingClientRect().top;
    const dot = nextRow.querySelector('.timeline-dot');
    const dotTop = dot ? dot.getBoundingClientRect().top : nextRow.getBoundingClientRect().top + 60;
    
    const targetHeight = (dotTop - containerTop) + 5; 
    track.style.height = `${targetHeight}px`;

    setTimeout(() => {
        nextRow.setAttribute('aria-hidden', 'false');
        nextRow.classList.add('is-revealed');
        
        setTimeout(() => {
            const targetHeading = nextRow.querySelector('h3');
            if (targetHeading) targetHeading.focus({preventScroll: true});
            
            const y = nextRow.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({top: y, behavior: 'smooth'});

            if (nextStep === totalSteps) {
                if (btnReset) btnReset.classList.add('is-visible');
            }
            
            // Remove transitioning class after scroll completes
            setTimeout(() => {
                document.body.classList.remove('timeline-transitioning');
            }, 500);
        }, 400); 
    }, 800); 
}

function resetPresentation() {
    // Reset to title page instead of reloading
    const titlePage = document.getElementById('title-page');
    const allRows = document.querySelectorAll('.timeline-row');
    const allBtns = document.querySelectorAll('.btn-action');
    
    // Hide all timeline rows
    allRows.forEach(row => {
        row.classList.remove('is-revealed');
        row.setAttribute('aria-hidden', 'true');
    });
    
    // Reset step-0 to initially revealed state
    const step0 = document.getElementById('step-0');
    if (step0) {
        step0.classList.add('is-revealed');
        step0.setAttribute('aria-hidden', 'false');
    }
    
    // Show all buttons again
    allBtns.forEach(btn => {
        btn.style.display = '';
        btn.style.opacity = '1';
    });
    
    // Reset timeline track
    track.style.height = '0';
    
    // Hide reset link
    if (btnReset) btnReset.classList.remove('is-visible');
    
    // Remove prospectus-active class to hide content
    document.body.classList.remove('prospectus-active');
    
    // Show title page
    titlePage.classList.remove('is-hidden');
    
    // Scroll to top
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function startProspectus() {
    console.log('startProspectus called');
    
    // 1. Find the first section of the document
    const firstStep = document.getElementById('step-0');
    const titlePage = document.getElementById('title-page');
    
    console.log('firstStep:', firstStep);
    console.log('titlePage:', titlePage);
    
    if (firstStep) {
        // 2. Hide title page
        if (titlePage) {
            titlePage.classList.add('is-hidden');
            titlePage.style.opacity = '0';
        }
        
        // 3. Reveal the prospectus
        document.body.classList.add('prospectus-active');
        
        // 4. Activate first step
        firstStep.setAttribute('aria-hidden', 'false');
        firstStep.classList.add('is-revealed');
        
        // 5. Smooth scroll to the content
        setTimeout(() => {
            firstStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } else {
        console.error("Audit Error: Target 'step-0' not found in HTML.");
    }
}

// Navigate from Executive Summary to Mission (step-0)
function enterProspectus(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const missionSection = document.getElementById('step-0');
    const titlePage = document.getElementById('title-page');

    if (!missionSection) {
        console.error('Mission section (step-0) not found!');
        return;
    }

    // Ensure step-0 is revealed
    missionSection.classList.add('is-revealed');
    missionSection.setAttribute('aria-hidden', 'false');

    // Hide title page if visible
    if (titlePage) {
        titlePage.classList.add('is-hidden');
        titlePage.style.display = 'none';
    }

    // Add prospectus-active class
    document.body.classList.add('prospectus-active');

    // Update timeline track height for step-0
    const track = document.getElementById('timelineTrack');
    const mainContent = document.getElementById('main-content');
    if (track && mainContent) {
        const containerTop = mainContent.getBoundingClientRect().top;
        const dot = missionSection.querySelector('.timeline-dot');
        const sectionTop = missionSection.getBoundingClientRect().top;
        const dotTop = dot ? dot.getBoundingClientRect().top : sectionTop + 60;
        const targetHeight = (dotTop - containerTop) + 5;
        track.style.height = targetHeight + 'px';
    }

    // Scroll to mission section with offset for header
    setTimeout(() => {
        const headerOffset = 80;
        const elementPosition = missionSection.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Focus the heading for accessibility
        const heading = missionSection.querySelector('h2, h3');
        if (heading) {
            heading.focus({ preventScroll: true });
        }
    }, 150);

    return false;
}

function printProspectus() {
    const allRows = document.querySelectorAll('.timeline-row');
    allRows.forEach(row => {
        row.classList.add('is-revealed');
        row.setAttribute('aria-hidden', 'false');
    });
    setTimeout(() => {
        window.print();
    }, 500);
}

// Mobile Summary Mode Toggle
function toggleSummaryMode() {
    const body = document.body;
    const toggleBtn = document.getElementById('mobileModeToggle');
    const ariaLive = document.getElementById('aria-live-region');
    
    body.classList.toggle('summary-mode');
    
    const isSummaryMode = body.classList.contains('summary-mode');
    
    // Update button text
    toggleBtn.textContent = isSummaryMode ? 'Timeline Mode' : 'Summary Mode';
    toggleBtn.setAttribute('aria-pressed', isSummaryMode ? 'true' : 'false');
    
    // Announce change to screen readers
    if (ariaLive) {
        ariaLive.textContent = isSummaryMode 
            ? 'Switched to summary mode. All sections are now displayed in a linear format.' 
            : 'Switched to timeline mode. Interactive timeline navigation is now active.';
    }
    
    // Scroll to top when switching modes
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// PDF Export Function
function exportToPDF() {
    // Reveal all content for PDF generation
    const allRows = document.querySelectorAll('.timeline-row');
    allRows.forEach(row => {
        row.classList.add('is-revealed');
        row.setAttribute('aria-hidden', 'false');
    });

    // Add temporary PDF-optimized class for cleaner output
    document.body.classList.add('pdf-export-active');

    // Set document title for PDF filename
    const originalTitle = document.title;
    document.title = 'Heaven-on-Earth-Foundation-Prospectus-April-2026';

    // Small delay to ensure content is revealed
    setTimeout(() => {
        // Trigger print dialog with PDF preset
        window.print();

        // Reset after print dialog closes
        setTimeout(() => {
            document.body.classList.remove('pdf-export-active');
            document.title = originalTitle;
        }, 1000);
    }, 500);
}

// Entity Architecture Modal Data & Controls
const entityData = {
    shield: {
        title: "Heaven on Earth Foundation",
        status: "IRC §508(c)(1)(A) Faith-Based / Philosophical Non-Profit (Operating under §501(c)(3) standards)",
        body: `
            <p><strong>Primary Function:</strong> Ultimate parent entity and custodian of the Foundation's core philosophical mission, overarching brand, and philanthropic capital.</p>
            <p><strong>Lender & Risk Protection:</strong> The Foundation operates with <strong>zero commercial debt</strong> and no direct operational liabilities. It is completely isolated from the day-to-day risks of hospitality, agriculture, and employment.</p>
            <p><strong>Financial Flow:</strong> Receives philanthropic donations, impact grants, and tax-free dividends from its commercial subsidiaries. It deploys capital exclusively for scholarships, land conservation trusts, and impact loan servicing.</p>
            <p><strong>The §508 to §501(c)(3) Safeguard:</strong> While operating under the mandatory §508(c)(1)(A) exception for integrated philosophical organizations, the Foundation maintains strict adherence to the IRS 14-Point Test. A formal Opinion Letter from specialized tax counsel validates this status. Should regulatory environments shift, a pre-planned legal migration to a standard §501(c)(3) Public Charity is triggered, ensuring zero interruption to operations or debt service.</p>
        `
    },
    governance: {
        title: "Philosophical Standards & Curriculum Council",
        status: "Internal Governance Committee (Fiduciary/Compliance Oversight)",
        body: `
            <p><strong>Primary Function:</strong> Maintains the integrity, standardization, and efficacy of the Enlightenment Intensive curriculum across all global campuses.</p>
            <p><strong>Translating "Lineage" to Operations:</strong> This council acts as the credentialing body. It oversees the rigorous training, certification, and continuing education of all retreat Facilitators (Monitors) and Master Instructors.</p>
            <p><strong>Anti-Inurement & Conflict of Interest:</strong> To comply with strict IRS regulations regarding private benefit, Council members are legally barred from holding equity in any commercial subsidiary or vendor. Their authority is restricted to <em>programmatic and philosophical quality control</em>, not operational or financial management.</p>
            <p><strong>Lender Benefit:</strong> Guarantees that the core product (the transformational experience) remains highly standardized, safe, and historically verified, protecting the brand's premium reputation globally.</p>
        `
    },
    vault: {
        title: "Heaven on Earth Global Holdings, LLC",
        status: "Nevada Limited Liability Company (Wholly Owned by Foundation)",
        body: `
            <p><strong>Primary Function:</strong> Centralized Intellectual Property holding vehicle. Owns all Sanctuary Operating Manuals, commercial branded SOPs, and proprietary delivery methodologies.</p>
            <p><strong>Why Nevada?:</strong> Selected for its robust corporate veil protections, favorable charging order statutes, and highly developed business court system.</p>
            <p><strong>Financial Flow (The Royalty Engine):</strong> Executes Master Intercompany Service Agreements (ISAs) with all operating subsidiaries. Licenses the "Standard of Excellence" operational playbook for a <strong>5–8% gross revenue royalty</strong>.</p>
            <p><strong>Tax & Compliance Strategy:</strong> This structure separates passive, tax-exempt royalty income (protected under IRC §512(b)(2)) from Unrelated Business Income Tax (UBIT). The royalty rate is validated by a Big Four independent transfer pricing study to ensure OECD compliance and defend against any IRS claims of improper financial flows.</p>
        `
    },
    engine: {
        title: "Heaven on Earth Enterprises, LLC",
        status: "Wyoming Limited Liability Company / Pending B-Corp Status",
        body: `
            <p><strong>Primary Function:</strong> The primary commercial operator. Manages all revenue-generating activities, including retreat hospitality, regenerative agriculture sales, and domestic staffing.</p>
            <p><strong>Lender & Risk Protection:</strong> This is the operational "shock absorber." It employs all W-2 staff, executes commercial leases, and holds primary liability insurance. If a slip-and-fall, labor dispute, or localized financial shortfall occurs, liability stops here and cannot pierce upward to the Foundation's philanthropic assets.</p>
            <p><strong>Financial Flow:</strong> Pays royalties up to Nevada Holdings. All remaining post-tax net profit is distributed upward to the Foundation as a dividend to fund scholarships and service impact debt.</p>
            <p><strong>Third-Party Boundaries:</strong> Executes strictly Fair Market Value (FMV) service agreements for any external vendors, ensuring no accidental joint-ventures or shared-liability traps.</p>
        `
    },
    anchors: {
        title: "International Subsidiaries & Shared Services",
        status: "Jurisdiction-Specific Entities (e.g., BC Society, Thai BOI, Bali PT PMA)",
        body: `
            <p><strong>Primary Function:</strong> Localized deployment of the Heaven on Earth model, leveraging regional tax, labor, and real estate incentives to maximize margin and impact.</p>
            <p><strong>The Global Rollout Alignment:</strong>
            <ul class="compact">
                <li><strong>Year 1 (BC Society):</strong> Validates the model via an asset-light management agreement.</li>
                <li><strong>Year 2 (Thai BOI LLC):</strong> Captures highly favorable tax-free incentives producing 60–75% projected margins (subject to final cost modelling and BOI confirmation).</li>
                <li><strong>Year 3 (Bali PT PMA):</strong> Establishes the spiritual prestige flagship.</li>
                <li><strong>Year 5 (Portugal TER):</strong> Secures European B2B expansion via institutional eco-tourism grants.</li>
            </ul></p>
            <p><strong>The "Silo" Defense Strategy:</strong> Each international campus operates as an independent legal silo. Cross-collateralization is strictly prohibited. If regulatory shifts affect the Thai campus, the BC and EU campuses remain entirely insulated from the fallout.</p>
        `
    },
    ngoExecution: {
        title: "Localized Execution & MOAs",
        status: "Jurisdictional Nexus & Operational Deployment",
        body: `
            <p><strong>Operational Deployment:</strong> Enterprises LLC or our regional hubs (such as the BC Society) act as the executing bodies for third-party agreements, ensuring all operations remain bound by their specific jurisdictional nexus.</p>
            <p><strong>Non-Profit Integration (e.g., KMC):</strong> When partnering with external faith-based or charitable networks—such as the <strong>Kingship Manna Coalition (KMC)</strong> non-profit entities—we utilize specific Memorandums of Agreement (MOAs) and Service Agreements. These agreements clearly define exact service deliverables and regional operational boundaries without blending corporate structures, ensuring local compliance while protecting our core assets.</p>
        `
    },
    ngoBoundaries: {
        title: "The Contractual 'Legal Moat'",
        status: "IP Quarantine & Arm's-Length Compliance",
        body: `
            <p><strong>Strict IP Quarantine:</strong> All external NGO and non-profit contracts maintain a strict IP quarantine. There is zero transfer of curriculum ownership or liturgical licensing to outside partners.</p>
            <p><strong>Liability Shield:</strong> Every MOA includes explicit 'No Joint Venture' clauses. This ensures that while we collaborate globally to serve communities, our proprietary methods and philanthropic capital remain completely insulated from outside partner liabilities.</p>
            <p><strong>Arm's-Length Financials:</strong> All inter-entity and third-party financial flows remain structured strictly as arm's-length transactions, compliant with OECD standards where applicable, avoiding any risk of private inurement or commingling of funds.</p>
        `
    },
    ngoGovernance: {
        title: "Executive Governance & Ratification",
        status: "Fiduciary Oversight & U.S. Tax Boundary Compliance",
        body: `
            <p><strong>Centralized Approval:</strong> Major NGO partnerships and large-scale external MOAs (including those with coalitions like KMC) cannot be executed solely at the localized campus level. They require formal ratification by the Board of Trustees.</p>
            <p><strong>The "Mind and Management" Requirement:</strong> Crucially, a U.S.-resident Trustee must be present and actively participate in these ratification decisions. This secures the domestic "Mind and Management" tax boundary, ensuring strict, ongoing compliance with U.S. tax-exempt regulations and maintaining bulletproof governance documentation.</p>
        `
    }
};

// Governance Hierarchy Modal Data
const governanceData = {
    board: {
        title: "Board of Trustees",
        status: "Ultimate Fiduciary Authority & Mission Oversight",
        body: `
            <p><strong>Primary Function:</strong> The Board holds ultimate fiduciary responsibility for the Foundation's assets, strategic direction, and compliance with IRC §508(c)(1)(A) regulations. Trustees are legally bound to act in the Foundation's best interest, not their own.</p>
            <p><strong>Key Powers:</strong></p>
            <ul>
                <li>Ratification of all major contracts and MOAs exceeding $100,000</li>
                <li>Approval of annual budgets and capital allocations</li>
                <li>Hiring and oversight of the Chief Financial Officer</li>
                <li>Establishment of governance policies and conflict-of-interest procedures</li>
            </ul>
            <p><strong>The "Mind and Management" Protocol:</strong> At least one U.S.-resident Trustee must participate in all major decisions, ensuring the Foundation maintains its domestic tax-exempt status and cannot be deemed a foreign-controlled entity.</p>
        `
    },
    founders: {
        title: "Jeannie Kim & Gordon McKay",
        status: "Founders & Cultural Stewards",
        body: `
            <p><strong>Primary Function:</strong> As Cultural Stewards, the Founders protect the philosophical integrity and spiritual lineage of the Enlightenment Intensive methodology. Their role is explicitly separated from financial and operational management.</p>
            <p><strong>Separation of Church and State:</strong></p>
            <ul>
                <li><strong>No Financial Authority:</strong> Founders do not sign checks, approve budgets, or authorize expenditures</li>
                <li><strong>No Operational Control:</strong> Day-to-day management is delegated to the CFO and Campus Directors</li>
                <li><strong>Curriculum Custodians:</strong> Authority over facilitator certification, retreat standards, and philosophical consistency</li>
                <li><strong>Anti-Inurement Compliance:</strong> Founders receive no equity, dividends, or profit distributions</li>
            </ul>
            <p><strong>Lender Assurance:</strong> This structural separation eliminates "Founder's Syndrome" risk — the Foundation cannot be held hostage by founders, nor can founders drain resources through related-party transactions.</p>
        `
    },
    cfo: {
        title: "Chief Financial Officer",
        status: "Executive Financial Operations (Search: 2 Finalists)",
        body: `
            <p><strong>Primary Function:</strong> The CFO serves as the operational financial gatekeeper, managing all commercial activities while maintaining strict arm's-length separation from the Foundation's philanthropic assets.</p>
            <p><strong>Core Responsibilities:</strong></p>
            <ul>
                <li><strong>Financial Operations:</strong> Accounts payable/receivable, payroll, loan servicing, cash flow management</li>
                <li><strong>Compliance & Reporting:</strong> Tax filings, audit coordination, lender reporting, UBIT management</li>
                <li><strong>Budget Authority:</strong> Operational budget execution within Board-approved parameters</li>
                <li><strong>Risk Management:</strong> Insurance oversight, contract review, liability mitigation</li>
            </ul>
            <p><strong>Executive Search Status:</strong> Two finalists identified, both with 15+ years non-profit/impact sector CFO experience. Final selection pending Board ratification. This proves to lenders that financial expertise is prioritized over founder control.</p>
        `
    },
    directors: {
        title: "Campus Directors",
        status: "Regional Operational Execution",
        body: `
            <p><strong>Primary Function:</strong> Campus Directors are empowered operational leaders responsible for executing the Heaven on Earth model within their specific jurisdiction while maintaining strict compliance with Foundation standards.</p>
            <p><strong>Operational Scope:</strong></p>
            <ul>
                <li><strong>Local Management:</strong> Staff hiring/training, vendor relationships, facility maintenance</li>
                <li><strong>Guest Experience:</strong> Retreat scheduling, facilitator coordination, quality assurance</li>
                <li><strong>Financial Execution:</strong> Local P&L management within approved budgets, revenue optimization</li>
                <li><strong>Community Relations:</strong> Local partnerships, regulatory compliance, cultural integration</li>
            </ul>
            <p><strong>Boundaries & Accountability:</strong> Directors report to the CFO for financial matters and the Standards Council for curriculum matters. They cannot modify retreat protocols, approve capital expenditures, or enter into contracts exceeding $25,000 without Board ratification.</p>
        `
    }
};

function openEntityModal(entityKey) {
    const data = entityData[entityKey];
    if (!data) return;
    
    document.getElementById('modalTitle').innerText = data.title;
    document.getElementById('modalStatus').innerText = data.status;
    document.getElementById('modalBody').innerHTML = data.body;
    
    document.getElementById('entityModal').classList.add('is-active');
    document.body.style.overflow = 'hidden';
}

function openGovernanceModal(roleKey) {
    const data = governanceData[roleKey];
    if (!data) return;
    
    document.getElementById('modalTitle').innerText = data.title;
    document.getElementById('modalStatus').innerText = data.status;
    document.getElementById('modalBody').innerHTML = data.body;
    
    document.getElementById('entityModal').classList.add('is-active');
    document.body.style.overflow = 'hidden';
}

function closeEntityModal() {
    document.getElementById('entityModal').classList.remove('is-active');
    document.body.style.overflow = 'auto';
}

function closeEntityModalOutside(event) {
    if (event.target.id === 'entityModal') {
        closeEntityModal();
    }
}

// Presenter Mode Toggle - Section Aware
function togglePresenterMode() {
    // Save current scroll position before any DOM changes
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    document.body.classList.toggle('presenter-notes-hidden');
    const btn = document.querySelector('.presenter-toggle-btn');
    if (btn) {
        const isHidden = document.body.classList.contains('presenter-notes-hidden');
        btn.textContent = isHidden ? 'Show Notes' : 'Hide Notes';
    }
    
    // If showing notes, only show for current section
    if (!document.body.classList.contains('presenter-notes-hidden')) {
        showNotesForCurrentSection();
    }
    
    // Restore scroll position to prevent jumping
    window.scrollTo(0, scrollPosition);
}

// Show presenter notes only for the currently visible section
function showNotesForCurrentSection() {
    const allSections = document.querySelectorAll('.timeline-row');
    const viewportCenter = window.innerHeight / 2;
    let currentSection = null;
    let maxOverlap = 0;
    
    // Find the section most visible in viewport
    allSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const overlap = Math.min(rect.bottom, viewportCenter) - Math.max(rect.top, 0);
        
        if (overlap > maxOverlap && rect.top <= viewportCenter && rect.bottom >= 0) {
            maxOverlap = overlap;
            currentSection = section;
        }
    });
    
    // Hide all presenter notes first
    document.querySelectorAll('.presenter-note, .presenter-notes, .presenter-notes-block').forEach(note => {
        note.style.display = 'none';
    });
    
    // Show notes only for current section
    if (currentSection) {
        const currentNotes = currentSection.querySelectorAll('.presenter-note, .presenter-notes, .presenter-notes-block');
        currentNotes.forEach(note => {
            note.style.display = 'block';
        });
    }
}

// Initialize with presenter notes hidden
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('presenter-notes-hidden');
    
    // Add scroll listener for section-aware presenter notes
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        // Only update if presenter mode is active
        if (!document.body.classList.contains('presenter-notes-hidden')) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(showNotesForCurrentSection, 100);
        }
    });
});

// FAQ Accordion Handler - Accordion Mode (only one open at a time per group)
function initFAQ() {
    const faqButtons = document.querySelectorAll('.faq-q');
    
    // P0: Dynamically add ARIA controls for accessibility
    faqButtons.forEach((button, index) => {
        const answerPanel = button.parentElement.querySelector('.faq-a');
        if (answerPanel && !answerPanel.id) {
            const uniqueId = `faq-answer-${index}`;
            answerPanel.id = uniqueId;
            button.setAttribute('aria-controls', uniqueId);
        }
        
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            const parentList = button.closest('.faq-list, .entity-list');
            
            // Close all other items in the same accordion group
            if (parentList) {
                const siblingButtons = parentList.querySelectorAll('.faq-q');
                siblingButtons.forEach(sibling => {
                    if (sibling !== button) {
                        sibling.setAttribute('aria-expanded', 'false');
                    }
                });
            }
            
            // Toggle the clicked item
            button.setAttribute('aria-expanded', !isExpanded);
            
            // P0: Keep accordion button in view when expanding (prevent scroll jump)
            // Only scroll if not during timeline transition (avoid conflict with advanceTimeline)
            if (!isExpanded && !document.body.classList.contains('timeline-transitioning')) {
                requestAnimationFrame(() => {
                    button.scrollIntoView({ block: 'nearest', behavior: 'instant' });
                });
            }
        });
    });
    
    // P0: Escape key handler to close all accordions
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            faqButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
        }
    });
}

// Initialize FAQ accordions on DOM ready
document.addEventListener('DOMContentLoaded', initFAQ);

// Reveal final block with smooth scroll enhancement
function revealFinalBlock() {
    const finalSection = document.getElementById('final-block') || document.querySelector('.final-block');
    if (finalSection) {
        finalSection.classList.add('is-revealed');
        finalSection.setAttribute('aria-hidden', 'false');
        
        // Smooth scroll to final section
        setTimeout(() => {
            finalSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 100);
        
        // Update timeline track
        setTimeout(() => {
            const track = document.getElementById('timelineTrack');
            const container = document.getElementById('main-content');
            if (track && container && finalSection) {
                const containerTop = container.getBoundingClientRect().top;
                const sectionTop = finalSection.getBoundingClientRect().top;
                track.style.height = ((sectionTop - containerTop) + 100) + 'px';
            }
        }, 600);
    }
}

// Smooth scroll helper for any element
function smoothScrollTo(elementId, offset = 0) {
    // Hide title page if going to main content
    if (elementId === 'step-0') {
        const titlePage = document.getElementById('title-page');
        if (titlePage && !titlePage.classList.contains('is-hidden')) {
            titlePage.classList.add('is-hidden');
            document.body.classList.add('prospectus-active');
        }
    }
    
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Pitch Deck Toggle
function togglePitchDeck() {
    document.body.classList.toggle('pitch-deck-hidden');
    const btn = document.querySelector('.footer-pitch-toggle');
    if (btn) {
        const isHidden = document.body.classList.contains('pitch-deck-hidden');
        btn.textContent = isHidden ? 'Show Pitch' : 'Hide Pitch';
    }
}

// Scroll Progress Indicator
function initScrollProgress() {
    const progressContainer = document.getElementById('scrollProgressContainer');
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressContainer || !progressBar) return;

    function updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        progressBar.style.width = progress + '%';
        
        // Show progress bar only after scrolling past title page
        if (scrollTop > window.innerHeight * 0.3) {
            progressContainer.classList.add('visible');
        } else {
            progressContainer.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial call
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('presenter-notes-hidden');
    document.body.classList.add('pitch-deck-hidden');
    initScrollProgress();
});

// Crown-Down Architecture Modal Functions
function openCrownModal() {
    const modal = document.getElementById('crownArchitectureModal');
    if (modal) {
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        // Announce to screen readers
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = 'Crown-Down Architecture modal opened';
        }
    }
}

// Toggle Crown box presenter notes
function toggleCrownBox(box) {
    const isExpanded = box.classList.contains('is-expanded');

    // Close all other boxes first (accordion behavior)
    document.querySelectorAll('.crown-box.is-expanded').forEach(function(otherBox) {
        if (otherBox !== box) {
            otherBox.classList.remove('is-expanded');
            otherBox.setAttribute('aria-expanded', 'false');
        }
    });

    // Toggle current box
    if (isExpanded) {
        box.classList.remove('is-expanded');
        box.setAttribute('aria-expanded', 'false');
    } else {
        box.classList.add('is-expanded');
        box.setAttribute('aria-expanded', 'true');
    }
}

// Keyboard support for crown boxes
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const box = document.activeElement;
        if (box && box.classList.contains('crown-box')) {
            e.preventDefault();
            toggleCrownBox(box);
        }
    }
});

function closeCrownModal() {
    const modal = document.getElementById('crownArchitectureModal');
    if (modal) {
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
        // Reset all expanded boxes
        document.querySelectorAll('.crown-box.is-expanded').forEach(function(box) {
            box.classList.remove('is-expanded');
            box.setAttribute('aria-expanded', 'false');
        });
        // Reset all protection cards
        document.querySelectorAll('.crown-protection-item[aria-expanded="true"]').forEach(function(card) {
            card.setAttribute('aria-expanded', 'false');
        });
        // Announce to screen readers
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = 'Crown-Down Architecture modal closed';
        }
    }
}

// Toggle Protection Card presenter notes
function toggleProtectionCard(card) {
    const isExpanded = card.getAttribute('aria-expanded') === 'true';

    // Close all other protection cards first (accordion behavior)
    document.querySelectorAll('.crown-protection-item[aria-expanded="true"]').forEach(function(otherCard) {
        if (otherCard !== card) {
            otherCard.setAttribute('aria-expanded', 'false');
        }
    });

    // Toggle current card
    if (isExpanded) {
        card.setAttribute('aria-expanded', 'false');
    } else {
        card.setAttribute('aria-expanded', 'true');
    }
}

// Keyboard support for protection cards
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const card = document.activeElement;
        if (card && card.classList.contains('crown-protection-item')) {
            e.preventDefault();
            toggleProtectionCard(card);
        }
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCrownModal();
    }
});

// Close modal on backdrop click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('crownArchitectureModal');
    if (e.target === modal) {
        closeCrownModal();
    }
    const govModal = document.getElementById('governanceStructureModal');
    if (e.target === govModal) {
        closeGovernanceModal();
    }
});

// Governance Structure Modal Functions
function openGovernanceModal() {
    const modal = document.getElementById('governanceStructureModal');
    if (modal) {
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = 'Governance Structure modal opened';
        }
    }
}

// Toggle Governance chart box presenter notes
function toggleGovernanceBox(box) {
    const isExpanded = box.classList.contains('is-expanded');

    // Close all other boxes first (accordion behavior)
    document.querySelectorAll('.gov-chart-box.is-expanded').forEach(function(otherBox) {
        if (otherBox !== box) {
            otherBox.classList.remove('is-expanded');
            otherBox.setAttribute('aria-expanded', 'false');
        }
    });

    // Toggle current box
    if (isExpanded) {
        box.classList.remove('is-expanded');
        box.setAttribute('aria-expanded', 'false');
    } else {
        box.classList.add('is-expanded');
        box.setAttribute('aria-expanded', 'true');
    }
}

// Keyboard support for governance boxes
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const box = document.activeElement;
        if (box && box.classList.contains('gov-chart-box')) {
            e.preventDefault();
            toggleGovernanceBox(box);
        }
    }
});

function closeGovernanceModal() {
    const modal = document.getElementById('governanceStructureModal');
    if (modal) {
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
        // Reset all expanded chart boxes
        document.querySelectorAll('.gov-chart-box.is-expanded').forEach(function(box) {
            box.classList.remove('is-expanded');
            box.setAttribute('aria-expanded', 'false');
        });
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = 'Governance Structure modal closed';
        }
    }
}

// Close governance modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCrownModal();
        closeGovernanceModal();
    }
});

// Subtle fade-in for Executive Summary sections (consistent with timeline reveals)
function initExecSummaryFadeIn() {
    const execElements = document.querySelectorAll('.deal-card, .proof-points, .risk-spectrum, .strategic-pillars, .impact-metrics, .protections-bar, .exec-cta');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    execElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s var(--premium-ease), transform 0.6s var(--premium-ease)';
        fadeObserver.observe(el);
    });
}

// Initialize Executive Summary fade-in on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initExecSummaryFadeIn();
});