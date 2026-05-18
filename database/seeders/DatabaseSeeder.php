<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Module;
use App\Models\Organization;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Roles
        foreach (['admin', 'manager', 'hr', 'learner'] as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // Default org
        $org = Organization::firstOrCreate(['name' => 'Default Organisation']);

        // Subscription
        Subscription::firstOrCreate(
            ['organization_id' => $org->id],
            [
                'plan_name'  => 'Professional',
                'start_date' => now()->toDateString(),
                'end_date'   => now()->addYear()->toDateString(),
                'status'     => 'active',
            ]
        );

        // Admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@lms.local'],
            [
                'name'            => 'Admin',
                'password'        => bcrypt('password'),
                'organization_id' => $org->id,
            ]
        );
        $admin->syncRoles(['admin']);

        // Manager
        $manager = User::firstOrCreate(
            ['email' => 'manager@lms.local'],
            [
                'name'            => 'Manager',
                'password'        => bcrypt('password'),
                'organization_id' => $org->id,
            ]
        );
        $manager->syncRoles(['manager']);

        // HR
        $hr = User::firstOrCreate(
            ['email' => 'hr@lms.local'],
            [
                'name'            => 'HR Officer',
                'password'        => bcrypt('password'),
                'organization_id' => $org->id,
            ]
        );
        $hr->syncRoles(['hr']);

        // Learner
        $learner = User::firstOrCreate(
            ['email' => 'learner@lms.local'],
            [
                'name'            => 'Learner',
                'password'        => bcrypt('password'),
                'organization_id' => $org->id,
            ]
        );
        $learner->syncRoles(['learner']);

        // Sample courses
        $courses = [
            [
                'title'          => 'ISO 27001 Fundamentals',
                'description'    => 'Understand the requirements and controls of ISO/IEC 27001 for information security management.',
                'version'        => '2.0',
                'framework_tags' => ['ISO 27001', 'ISMS'],
                'status'         => 'published',
                'modules'        => [
                    ['title' => 'Introduction to ISO 27001', 'type' => 'text', 'content' => '<h2>What is ISO 27001?</h2><p>ISO/IEC 27001 is an international standard on how to manage information security. It details requirements for establishing, implementing, maintaining and continually improving an information security management system (ISMS).</p><p>The standard was originally published jointly by the International Organization for Standardization (ISO) and the International Electrotechnical Commission (IEC) in 2005 and has been revised since.</p>'],
                    ['title' => 'ISMS Scope and Context', 'type' => 'text', 'content' => '<h2>Defining ISMS Scope</h2><p>Clause 4 of ISO 27001 requires organisations to understand their internal and external context, the needs and expectations of interested parties, and to define the scope of the ISMS.</p><p>The scope defines which parts of the organisation are covered — it may be a single department, a site, or the entire organisation.</p>'],
                    ['title' => 'Risk Assessment', 'type' => 'text', 'content' => '<h2>Information Security Risk Assessment</h2><p>Clause 6.1.2 requires organisations to define and apply an information security risk assessment process. This includes identifying risks associated with assets, evaluating the likelihood and impact of each risk, and prioritising them.</p>'],
                    ['title' => 'Annex A Controls Overview', 'type' => 'text', 'content' => '<h2>Annex A Controls</h2><p>ISO 27001:2022 Annex A contains 93 controls grouped into four themes: Organisational (37), People (8), Physical (14), and Technological (34). Not all controls must be implemented — the Statement of Applicability documents which apply and why.</p>'],
                ],
            ],
            [
                'title'          => 'NIS2 Directive Compliance',
                'description'    => 'Prepare your organisation for the EU NIS2 Directive requirements on cybersecurity.',
                'version'        => '1.0',
                'framework_tags' => ['NIS2', 'EU Regulation'],
                'status'         => 'published',
                'modules'        => [
                    ['title' => 'NIS2 Overview', 'type' => 'text', 'content' => '<h2>The NIS2 Directive</h2><p>The Network and Information Security Directive 2 (NIS2) entered into force in January 2023, replacing the original NIS Directive. EU member states had until October 2024 to transpose it into national law.</p><p>NIS2 significantly expands the scope of sectors covered and introduces stricter security and reporting obligations.</p>'],
                    ['title' => 'Scope and Sectors', 'type' => 'text', 'content' => '<h2>Who Does NIS2 Apply To?</h2><p>NIS2 applies to medium and large organisations in 18 sectors including energy, transport, banking, health, digital infrastructure, and public administration. Organisations are categorised as "essential" or "important" entities.</p>'],
                    ['title' => 'Security Measures Required', 'type' => 'text', 'content' => '<h2>Required Security Measures</h2><p>Article 21 requires organisations to adopt risk-based security measures including: policies on risk analysis, incident handling, business continuity, supply chain security, network security, policies on cryptography, and multi-factor authentication.</p>'],
                    ['title' => 'Incident Reporting', 'type' => 'text', 'content' => '<h2>Incident Reporting Obligations</h2><p>NIS2 introduces strict reporting timelines: an early warning within 24 hours of becoming aware of a significant incident, an incident notification within 72 hours, and a final report within one month. Reports must be submitted to national CSIRTs or competent authorities.</p>'],
                ],
            ],
            [
                'title'          => 'Cybersecurity Awareness',
                'description'    => 'Essential security awareness training for all staff — phishing, passwords, social engineering and more.',
                'version'        => '3.1',
                'framework_tags' => ['Awareness', 'General'],
                'status'         => 'published',
                'modules'        => [
                    ['title' => 'Phishing and Email Threats', 'type' => 'text', 'content' => '<h2>Recognising Phishing Emails</h2><p>Phishing emails attempt to trick you into revealing sensitive information or clicking malicious links. Warning signs include unexpected urgency, requests for credentials, mismatched sender domains, and suspicious attachments.</p><p>Always verify unexpected requests by contacting the sender through a known channel — never through details in the suspicious email itself.</p>'],
                    ['title' => 'Password Security', 'type' => 'text', 'content' => '<h2>Strong Password Practices</h2><p>Use long, unique passwords for every account. A password manager makes this practical. Enable multi-factor authentication (MFA) wherever possible — even a weak password becomes far harder to exploit with MFA enabled.</p><p>Never reuse passwords across work and personal accounts.</p>'],
                    ['title' => 'Social Engineering', 'type' => 'text', 'content' => '<h2>Social Engineering Attacks</h2><p>Social engineering exploits human psychology rather than technical vulnerabilities. Common attacks include pretexting (fabricating a scenario), baiting (leaving infected USB drives), and vishing (voice phishing calls).</p><p>Always verify identities before granting access or sharing information — even if the request seems to come from a senior colleague or IT support.</p>'],
                    ['title' => 'Safe Internet Use', 'type' => 'text', 'content' => '<h2>Safe Browsing and Device Use</h2><p>Avoid public Wi-Fi for work without a VPN. Lock your screen when leaving your desk. Be cautious about what you share on social media — attackers use LinkedIn and other platforms to gather information for targeted attacks.</p><p>Report suspected security incidents to IT Security immediately — early reporting limits damage.</p>'],
                ],
            ],
        ];

        foreach ($courses as $courseData) {
            $modulesData = $courseData['modules'];
            unset($courseData['modules']);
            $courseData['created_by'] = $admin->id;

            $course = Course::firstOrCreate(['title' => $courseData['title']], $courseData);

            if ($course->modules()->count() === 0) {
                foreach ($modulesData as $pos => $mod) {
                    Module::create(array_merge($mod, ['course_id' => $course->id, 'position' => $pos]));
                }
            }
        }
    }
}
