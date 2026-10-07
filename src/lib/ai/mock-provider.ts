import { AIProvider, GenerationRequest, GenerationResult, ProviderModelInfo } from './types';
import {
  ProjectRequirements,
  UXArtifacts,
  UserFlowArtifact,
  UXAuditArtifact,
  UserStoriesArtifact,
  ResearchArtifact,
  UsabilityTestArtifact,
  DesignBriefArtifact,
} from '../types/project';

/**
 * MockProvider: High-fidelity local Mock AI engine.
 * Synthesizes structured, domain-tailored UX artifacts using offline heuristics and domain templates.
 * Clearly labeled as Mock AI (does NOT claim or pretend to be Claude or an external API).
 */
export class MockProvider implements AIProvider {
  readonly id = 'mock';
  readonly name = 'Mock AI (Offline Heuristics)';

  getModelInfo(): ProviderModelInfo {
    return {
      providerId: this.id,
      providerName: this.name,
      model: 'heuristic-rules-v1.0 (Mock AI)',
      isLocal: true,
      description:
        'Local rule-based Mock AI engine for testing and offline UX artifact generation without external API dependencies.',
      configured: true,
    };
  }

  async validate(): Promise<{ valid: boolean; message?: string }> {
    return { valid: true, message: 'Mock AI Provider is operational.' };
  }

  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const startTime = Date.now();
    const { requirements, artifactType } = request;

    // Simulate realistic generation latency (500ms)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const artifacts: UXArtifacts = {};

    if (artifactType === 'userFlow' || artifactType === 'all') {
      artifacts.userFlow = this.generateUserFlow(requirements);
    }
    if (artifactType === 'uxAudit' || artifactType === 'all') {
      artifacts.uxAudit = this.generateUXAudit(requirements);
    }
    if (artifactType === 'userStories' || artifactType === 'all') {
      artifacts.userStories = this.generateUserStories(requirements);
    }
    if (artifactType === 'researchPlan' || artifactType === 'all') {
      artifacts.researchPlan = this.generateResearchPlan(requirements);
    }
    if (artifactType === 'usabilityTesting' || artifactType === 'all') {
      artifacts.usabilityTesting = this.generateUsabilityTest(requirements);
    }
    if (artifactType === 'designBrief' || artifactType === 'all') {
      artifacts.designBrief = this.generateDesignBrief(requirements);
    }

    return {
      success: true,
      artifacts,
      provider: 'Mock AI',
      model: 'heuristic-rules-v1.0',
      executionTimeMs: Date.now() - startTime,
    };
  }

  public generateUserFlow(req: ProjectRequirements): UserFlowArtifact {
    const title = req.title || 'Product Feature';
    const persona = req.targetAudience || 'Primary User';
    const isFintech = req.productType === 'fintech';

    return {
      summary: `Primary user flow for ${title}, mapping the critical path from initial intent through validation, action execution, and post-transaction confirmation for ${persona}.`,
      primaryActor: persona,
      happyPathSteps: [
        {
          id: 'step-1',
          stepNumber: 1,
          title: 'Entry & Intent Discovery',
          userAction: `Navigates to the ${title} landing screen / dashboard widget and reviews overview information.`,
          systemResponse: 'Renders high-level summary, status badges, contextual balances/stats, and a clear primary Call-To-Action (CTA).',
          userEmotionOrIntent: 'Curious / Orienting',
          uiComponent: 'Dashboard Overview Card & Primary Action Button',
        },
        {
          id: 'step-2',
          stepNumber: 2,
          title: 'Input & Parameter Configuration',
          userAction: `Enters requirement parameters, selects options, and views live calculation or preview.`,
          systemResponse: 'Performs inline client-side validation, recalculates yield/fees/quotas, and enables continuation once all fields are valid.',
          userEmotionOrIntent: 'Focused / Calculating',
          uiComponent: 'Structured Form / Multi-Slider Input Group',
        },
        {
          id: 'step-3',
          stepNumber: 3,
          title: isFintech ? 'KYC / Authentication & Risk Review' : 'Review & Verification',
          userAction: isFintech
            ? 'Reviews breakdown of yield, bond maturity, platform fees, and approves 2FA/OTP authentication.'
            : 'Reviews summarized inputs, pricing/terms, and proceeds to confirmation.',
          systemResponse: 'Locks quote price for 60 seconds, displays security trust badges, and prompts verification code.',
          userEmotionOrIntent: 'Cautious / Seeking Reassurance',
          uiComponent: 'Order Summary Modal & 2FA Pin Pad',
          isDecisionPoint: true,
          alternativeBranch: 'Invalid 2FA or expired quote window triggers inline timer reset.',
        },
        {
          id: 'step-4',
          stepNumber: 4,
          title: 'Execution & Settlement State',
          userAction: 'Confirms final submission via biometric/PIN or primary action button.',
          systemResponse: 'Displays non-blocking optimistic loading animation with real-time status updates (Processing -> Settled).',
          userEmotionOrIntent: 'Anticipatory',
          uiComponent: 'Progressive Stepper & Settlement Indicator',
        },
        {
          id: 'step-5',
          stepNumber: 5,
          title: 'Confirmation & Downstream Next Steps',
          userAction: 'Views successful completion receipt, downloads invoice/certificate, or navigates back to portfolio.',
          systemResponse: 'Presents downloadable receipt, updates global account balance, and provides recommended next actions.',
          userEmotionOrIntent: 'Satisfied / Reassured',
          uiComponent: 'Success Banner, Transaction Receipt Card & Action Links',
        },
      ],
      alternativePaths: [
        {
          title: 'Session Timeout or Backgrounded Tab',
          condition: 'User leaves form idle for >5 minutes or switches browser tabs during verification.',
          steps: [
            'System pauses active quote timer',
            'Displays modal: "Your session has been paused to protect your rate"',
            'Allows 1-click refresh to re-validate rates without losing form inputs',
          ],
        },
        {
          title: 'Insufficient Balance / Authorization Limit',
          condition: 'Payment gateway or linked wallet reports insufficient funds.',
          steps: [
            'System preserves entered transaction details in local state',
            'Presents quick top-up modal or alternative payment method selector',
            'Resumes transaction automatically once balance is confirmed',
          ],
        },
      ],
      edgeCasesAndErrors: [
        {
          scenario: 'Network Disconnection during Final Submit',
          recoveryStrategy: 'Implement idempotent request keys; display retry button with preserved cached payload instead of creating duplicate records.',
          severity: 'high',
        },
        {
          scenario: 'Rate Limit / High Market Volatility Spike',
          recoveryStrategy: 'Alert user with clear difference delta and 10-second accept/reject countdown rather than silent execution.',
          severity: 'high',
        },
        {
          scenario: 'Partial Form Abandonment',
          recoveryStrategy: 'Save draft to local storage; prompt "Resume where you left off" upon next visit.',
          severity: 'medium',
        },
      ],
    };
  }

  public generateUXAudit(req: ProjectRequirements): UXAuditArtifact {
    const isFintech = req.productType === 'fintech';

    return {
      overallScore: 84,
      executiveSummary: `Heuristic evaluation and accessibility audit for ${req.title}. Identifies core UX friction points across Nielsen Norman Usability Heuristics and WCAG 2.2 accessibility standards with prioritized remediation strategies.`,
      findings: [
        {
          id: 'audit-1',
          heuristic: 'Visibility of System Status (Heuristic #1)',
          title: 'Missing Progress Transparency in Multi-Step Flow',
          description: 'Users in complex flows often lack visual confirmation of total steps remaining and current save status.',
          severity: 'major',
          wcagReference: 'WCAG 3.2.2 (On Input)',
          impactedUserGroup: 'First-time users & users on mobile screens',
          recommendation: 'Add persistent numbered stepper with clear completion indicators and auto-saved draft status tag.',
        },
        {
          id: 'audit-2',
          heuristic: 'Error Prevention & Recovery (Heuristic #5 & #9)',
          title: isFintech ? 'Lack of Confirmation for Irreversible Financial Actions' : 'Destructive Action Confirmation',
          description: 'High-stakes submissions can be triggered without explicit secondary friction or summary review.',
          severity: 'critical',
          wcagReference: 'WCAG 3.3.4 (Error Prevention - Legal, Financial, Data)',
          impactedUserGroup: 'All users, especially high-volume or mobile users',
          recommendation: 'Implement a structured review step with itemized breakdown and mandatory explicit confirmation checkbox or slide-to-confirm.',
        },
        {
          id: 'audit-3',
          heuristic: 'Accessibility & Contrast (WCAG 2.2)',
          title: 'Subtle Secondary Text Fails 4.5:1 Contrast Threshold',
          description: 'Muted helper text and placeholder colors in light/dark themes currently hover around 3.2:1 contrast.',
          severity: 'major',
          wcagReference: 'WCAG 1.4.3 (Contrast Minimum - Level AA)',
          impactedUserGroup: 'Users with low vision or working in high ambient glare environments',
          recommendation: 'Increase text color luminance to achieve minimum 4.8:1 contrast on all background surface variations.',
        },
        {
          id: 'audit-4',
          heuristic: 'Recognition Rather Than Recall (Heuristic #6)',
          title: 'Complex Technical Terminology without Contextual Tooltips',
          description: 'Domain-specific acronyms and jargon are presented without explanatory inline microcopy.',
          severity: 'minor',
          wcagReference: 'WCAG 3.1.3 (Unusual Words)',
          impactedUserGroup: 'Novice & retail investors',
          recommendation: 'Attach accessible dotted-underline tooltips (triggerable on hover and tap) explaining terms in plain language.',
        },
        {
          id: 'audit-5',
          heuristic: 'Touch Target Size & Spacing (WCAG 2.2)',
          title: 'Mobile Action Buttons Below 44x44px Hit Target',
          description: 'Secondary icon buttons in table rows measure 28x28px, increasing tap error rates on touchscreens.',
          severity: 'minor',
          wcagReference: 'WCAG 2.5.8 (Target Size Minimum - Level AA)',
          impactedUserGroup: 'Mobile users and individuals with motor impairments',
          recommendation: 'Pad interactive targets to a minimum of 48x48px bounding box with 8px clearance between adjacent actions.',
        },
      ],
      wcagComplianceSummary: {
        level: 'AA',
        passRateEstimated: '88%',
        keyCheckpoints: [
          'Color Contrast: Meets AA for primary text, needs fix on secondary placeholders',
          'Keyboard Navigation: Focus indicators required on custom dropdown elements',
          'Aria Labels: Icon buttons must have explicit aria-label attributes',
          'Error Identification: Inline error messages must link to input fields via aria-describedby',
        ],
      },
      priorityFixes: [
        'Fix secondary text contrast across all form helpers to meet WCAG AA (4.5:1).',
        'Introduce two-step confirmation modal for high-stakes transaction submissions.',
        'Expand mobile touch target sizes for all row action buttons to >= 48px.',
        'Add live region (aria-live="polite") for dynamic price/rate updates.',
      ],
    };
  }

  public generateUserStories(req: ProjectRequirements): UserStoriesArtifact {
    const audience = req.targetAudience || 'End User';
    const title = req.title || 'Feature';

    return {
      summary: `Agile user stories with Gherkin acceptance criteria (Given-When-Then), persona mapping, and UX edge case considerations for ${title}.`,
      personasIdentified: [
        `${audience} (Primary)`,
        'Compliance & Risk Officer (Secondary)',
        'Support Specialist (Operational)',
      ],
      stories: [
        {
          id: 'story-1',
          persona: audience,
          title: `Configure and initiate ${title}`,
          story: `As a ${audience}, I want to configure my preferred parameters with live feedback, so that I can make an informed, confident decision without unexpected surprises.`,
          acceptanceCriteria: [
            {
              scenario: 'Valid parameter entry with real-time recalculation',
              given: 'the user is on the configuration screen with valid credentials',
              when: 'the user changes any input field (e.g. amount, tenure, filter)',
              then: 'the breakdown table updates within 200ms with formatted currency/units and clear totals',
            },
            {
              scenario: 'Input exceeds maximum allowed limits',
              given: 'the maximum limit is defined for this user profile',
              when: 'the user types an amount higher than the limit',
              then: 'the input field displays an inline warning banner with the max amount and a 1-click "Set to Max" button',
            },
          ],
          edgeCases: [
            'Zero or negative numbers in numeric fields',
            'Pasting rich text or symbols into numeric inputs',
            'Network latency when fetching live conversion rates',
          ],
          storyPointsEstimate: 5,
          priority: 'must-have',
        },
        {
          id: 'story-2',
          persona: audience,
          title: 'Review and safely execute transaction with 2FA',
          story: `As a ${audience}, I want to review an itemized breakdown and verify with 2FA, so that I can prevent accidental submissions and ensure account security.`,
          acceptanceCriteria: [
            {
              scenario: 'Successful review and OTP verification',
              given: 'the user has reviewed the summary modal with active quote lock',
              when: 'the user enters the correct 6-digit OTP within the timer window',
              then: 'the transaction is submitted idempotently and the success state is rendered',
            },
            {
              scenario: 'Quote timer expiration during review',
              given: 'the 60-second quote window expires while the user is on the OTP screen',
              when: 'the timer reaches 0:00',
              then: 'the submit button is disabled and a prompt asks the user to refresh the updated quote',
            },
          ],
          edgeCases: [
            'SMS delay > 60 seconds',
            'Multiple rapid taps on the confirm button',
            'Back navigation during in-flight submission',
          ],
          storyPointsEstimate: 8,
          priority: 'must-have',
        },
        {
          id: 'story-3',
          persona: audience,
          title: 'Access history, receipts, and status tracking',
          story: `As a ${audience}, I want to view my transaction receipt and download proof, so that I have records for auditing and tax purposes.`,
          acceptanceCriteria: [
            {
              scenario: 'Download PDF receipt',
              given: 'the transaction is in "Completed" or "Settled" state',
              when: 'the user clicks "Download Receipt"',
              then: 'a branded PDF receipt containing transaction hash, timestamp, and breakdown is generated',
            },
          ],
          edgeCases: ['Pending status taking longer than 24 hours', 'Failed transaction receipt explanation'],
          storyPointsEstimate: 3,
          priority: 'should-have',
        },
      ],
    };
  }

  public generateResearchPlan(req: ProjectRequirements): ResearchArtifact {
    const audience = req.targetAudience || 'Target Users';

    return {
      objective: `Uncover mental models, trust triggers, usability friction points, and decision criteria for ${audience} when interacting with ${req.title}.`,
      hypotheses: [
        {
          hypothesis: `Users hesitate to complete the flow because the cost/yield breakdown is not transparent enough before the final step.`,
          riskLevel: 'high',
          metricOrSignal: 'Drop-off rate on review step > 35%; qualitative user hesitation comments.',
        },
        {
          hypothesis: `Providing contextual benchmarks and peer comparison increases user confidence and completion rate by at least 20%.`,
          riskLevel: 'medium',
          metricOrSignal: 'A/B test completion lift and task ease rating (SEQ).',
        },
        {
          hypothesis: `Mobile users prefer biometric verification over SMS OTP due to SMS delivery latency.`,
          riskLevel: 'medium',
          metricOrSignal: 'Verification completion time (<15s vs >45s for OTP).',
        },
      ],
      interviewQuestions: [
        {
          id: 'q-1',
          category: 'mental-model',
          question: `Walk me through the last time you completed a similar task or transaction. What factors were most important to you?`,
          probingFollowUp: 'What caused you the most hesitation or uncertainty during that process?',
          targetInsight: 'Understand user baseline expectations and current alternative workarounds.',
        },
        {
          id: 'q-2',
          category: 'pain-point',
          question: `When looking at this summary screen, what information would you look for first before pressing confirm?`,
          probingFollowUp: 'Is there anything here that feels unclear or makes you feel you need to double-check elsewhere?',
          targetInsight: 'Identify missing reassurance triggers and information hierarchy flaws.',
        },
        {
          id: 'q-3',
          category: 'behavior',
          question: `How do you typically manage errors or transaction delays in other platforms you use?`,
          probingFollowUp: 'How soon do you expect an email/SMS confirmation vs in-app notification?',
          targetInsight: 'Define notification SLA expectations and feedback loops.',
        },
        {
          id: 'q-4',
          category: 'validation',
          question: `On a scale of 1 to 5, how clear is the fee and yield calculation shown here? What would make it a 5?`,
          probingFollowUp: 'Would visual diagrams or charts help clarify this more than raw numbers?',
          targetInsight: 'Determine if tabular data or graphical visualization is preferred.',
        },
      ],
      surveyPrompts: [
        {
          prompt: 'How confident did you feel about the total costs and details before submitting?',
          responseType: 'Likert Scale (1-5)',
        },
        {
          prompt: 'Which feature would most improve your trust in this platform?',
          responseType: 'Multiple Choice',
        },
        {
          prompt: 'What was the most confusing part of this experience, if any?',
          responseType: 'Open-ended',
        },
      ],
    };
  }

  public generateUsabilityTest(req: ProjectRequirements): UsabilityTestArtifact {
    const audience = req.targetAudience || 'Qualified Representative User';

    return {
      testGoal: `Evaluate task completion rate, cognitive workload (NASA-TLX / SEQ), and user comprehension of error recovery states for ${req.title}.`,
      targetParticipantProfile: `${audience} with moderate digital familiarity; mix of desktop and mobile devices.`,
      recommendedSampleSize: 5,
      tasks: [
        {
          id: 'task-1',
          taskNumber: 1,
          scenario: `Imagine you want to start using ${req.title} for the first time. You have a specific goal to configure and execute a transaction of $1,000 (or equivalent).`,
          participantPrompt: `Please find the feature on the dashboard and proceed through the initial setup until you reach the review screen. Think aloud as you make selections.`,
          successCriteria: 'Participant locates CTA in <30s, inputs $1,000 without validation errors, and reaches review screen without asking for moderator guidance.',
          maxExpectedDurationMinutes: 3,
          potentialFrictionPoints: [
            'Locating the primary CTA among dashboard clutter',
            'Misunderstanding input format or minimum required balance',
          ],
        },
        {
          id: 'task-2',
          taskNumber: 2,
          scenario: `You are on the review screen. Before confirming, you want to verify what happens if you cancel or if the rate changes.`,
          participantPrompt: `Examine the terms on this screen and explain in your own words what charges or lock-in periods apply. Then confirm the transaction.`,
          successCriteria: 'Participant identifies the timer countdown and fee breakdown accurately, enters verification code, and observes the confirmation screen.',
          maxExpectedDurationMinutes: 4,
          potentialFrictionPoints: [
            'Missing the expiration countdown timer',
            'Hesitation around cancellation consequences',
          ],
        },
        {
          id: 'task-3',
          taskNumber: 3,
          scenario: `The transaction has completed. You want to save a record for your personal finances and see where this appears in your history.`,
          participantPrompt: `Find and download your receipt, then locate this past transaction in your main account view.`,
          successCriteria: 'Participant downloads receipt PDF and navigates to the history tab within 2 clicks.',
          maxExpectedDurationMinutes: 2,
          potentialFrictionPoints: [
            'Missing the download receipt link on the confirmation card',
            'Confusion finding the navigation back to main dashboard',
          ],
        },
      ],
      quantitativeMetricsToCollect: [
        'Task Success Rate (Target >= 85%)',
        'Time on Task (Target <= 3.5 minutes per core task)',
        'Single Ease Question - SEQ (Target >= 5.8 / 7.0)',
        'System Usability Scale - SUS (Target >= 78 / 100)',
        'Error Frequency & Mis-click Count',
      ],
      postTestQuestions: [
        'What was the single most difficult or confusing step during the test?',
        'If you could change one thing about this interface, what would it be?',
        'How would you describe this tool to a colleague or peer in one sentence?',
      ],
    };
  }

  public generateDesignBrief(req: ProjectRequirements): DesignBriefArtifact {
    const audience = req.targetAudience || 'Primary User';
    const title = req.title || 'Product Feature';
    const isFintech = req.productType === 'fintech';

    return {
      executiveSummary: `Design specification and UX brief for ${title}. Aligns product intent, user psychology, information hierarchy, and design system tokens for engineering and design handoff.`,
      targetAudienceProfile: {
        primaryPersona: audience,
        corePainPoints: [
          req.problemStatement || 'High friction in understanding complex domain steps',
          'Anxiety around rate fluctuations and transaction finality',
          'Lack of immediate visual feedback during multi-step validation',
        ],
        mentalModel: isFintech
          ? 'Users compare this experience to banking and brokerage apps; they expect extreme security reassurance, explicit fee breakdowns, and zero surprises.'
          : 'Users expect high-speed, keyboard-friendly flows with instant live previews and zero unnecessary modal interruptions.',
      },
      designPrinciples: [
        {
          title: 'Clarity Over Cleverness',
          rationale: 'In high-stakes interactions, explicit labels and plain-language helper microcopy must always triumph over ambiguous icons or nested menus.',
          tacticalGuidelines: [
            'Every numeric field must show inline unit/currency symbols and real-time calculation previews.',
            'Display error messages adjacent to the originating input with specific recovery advice.',
          ],
        },
        {
          title: 'Progressive Disclosure & Predictable Friction',
          rationale: 'Do not overwhelm users with secondary parameters on step 1. Introduce validation friction purposefully before irreversible actions.',
          tacticalGuidelines: [
            'Keep initial input forms limited to maximum 3 primary parameters.',
            'Mandate an itemized summary modal before 2FA / final execution.',
          ],
        },
        {
          title: 'Defensive UI & Optimistic Feedback',
          rationale: 'Anticipate network latency, token timeouts, and concurrent edits.',
          tacticalGuidelines: [
            'Implement optimistic status badges that gracefully degrade to retry banners on failure.',
            'Preserve form draft state in localStorage if the user leaves the tab.',
          ],
        },
      ],
      visualAndSpatialGuidelines: {
        layoutDensity: 'Comfortable (8px grid with 16px-24px component padding).',
        typographyHierarchy: 'Inter font with strict scale: H1 24px/32px semi-bold, Body 14px/20px regular, Microcopy 12px/16px.',
        colorSystemGuidance: 'High-contrast neutral dark palette (#09090b surface, #f4f4f5 foreground) with Teal (#0d9488) primary accent and Emerald/Amber/Rose semantic states.',
        elevationAndBorders: 'Subtle 1px border (#27272a) with minimal backdrop blur rather than heavy drop shadows.',
      },
      accessibilityDirectives: [
        'All interactive touch targets must meet minimum 48x48px on mobile viewports (WCAG 2.5.8).',
        'Text contrast must exceed 4.5:1 for standard text and 3.0:1 for large display headers (WCAG 1.4.3).',
        'All form elements must maintain visible 2px teal focus rings on keyboard tab navigation (WCAG 2.4.7).',
        'Dynamic timer updates and live calculation deltas must be announced via aria-live="polite".',
      ],
      scopeAndMilestones: [
        {
          phase: 'Phase 1: Wireframing & Flow Validation',
          deliverables: ['Low-fidelity wireflow mapping happy path & 3 edge case branches', 'Moderated user testing with 5 participants'],
          targetDuration: '1 Week',
        },
        {
          phase: 'Phase 2: High-Fidelity UI & Token Alignment',
          deliverables: ['Figma interactive component prototype with light/dark variants', 'Design system token mapping & WCAG AA audit approval'],
          targetDuration: '2 Weeks',
        },
        {
          phase: 'Phase 3: Production Handoff & QA Review',
          deliverables: ['Gherkin acceptance criteria sign-off', 'Frontend design QA audit on staging build'],
          targetDuration: '1 Week',
        },
      ],
    };
  }
}
