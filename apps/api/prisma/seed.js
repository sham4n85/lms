"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await bcrypt.hash('password123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@lms.com' },
        update: {},
        create: {
            email: 'admin@lms.com',
            passwordHash,
            name: 'Admin User',
            role: client_1.UserRole.ADMIN,
            emailVerified: true,
        },
    });
    const instructor = await prisma.user.upsert({
        where: { email: 'instructor@lms.com' },
        update: {},
        create: {
            email: 'instructor@lms.com',
            passwordHash,
            name: 'John Instructor',
            role: client_1.UserRole.INSTRUCTOR,
            emailVerified: true,
            bio: 'Experienced instructor with 10+ years in web development.',
        },
    });
    const student = await prisma.user.upsert({
        where: { email: 'student@lms.com' },
        update: {},
        create: {
            email: 'student@lms.com',
            passwordHash,
            name: 'Jane Student',
            role: client_1.UserRole.STUDENT,
            emailVerified: true,
        },
    });
    const course = await prisma.course.upsert({
        where: { slug: 'getting-started-with-web-development' },
        update: {},
        create: {
            title: 'Getting Started with Web Development',
            slug: 'getting-started-with-web-development',
            description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for absolute beginners.',
            shortDescription: 'Master the basics of HTML, CSS, and JavaScript.',
            difficulty: 'beginner',
            isFree: true,
            isPublished: true,
            instructorId: instructor.id,
            price: 0,
        },
    });
    const section = await prisma.section.create({
        data: {
            courseId: course.id,
            title: 'Introduction to HTML',
            sortOrder: 1,
        },
    });
    await prisma.lesson.createMany({
        data: [
            {
                sectionId: section.id,
                title: 'What is HTML?',
                type: 'TEXT',
                content: '<p>HTML stands for HyperText Markup Language. It is the standard language for creating web pages.</p><p>In this lesson, we will explore the basic structure of an HTML document.</p>',
                sortOrder: 1,
                isPreview: true,
            },
            {
                sectionId: section.id,
                title: 'HTML Tags and Elements',
                type: 'TEXT',
                content: '<p>HTML uses tags to define elements. Tags are surrounded by angle brackets: <code>&lt;tagname&gt;</code>.</p>',
                sortOrder: 2,
            },
        ],
    });
    console.log('Seed data created successfully');
    console.log({ admin: admin.email, instructor: instructor.email, student: student.email });
    console.log('Password for all: password123');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map