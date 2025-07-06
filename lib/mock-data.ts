// Define types based on the Mongoose schemas
export interface Slide {
  _id: string
  courseId: string
  lessonId?: string // Made optional based on your entity
  order: number // Added order
  title: string
  content?: string
  titleFont?: string
  startingCode?: string
  solutionCode?: string
  imageUrls: string[] // Changed to array
  backgroundColor: string
  textColor: string
  themeColors: {
    main: string
    secondary: string
  }
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  _id: string
  courseId: string
  title: string // Changed from lessonTitle
  description?: string // Changed from lessonDescription
  slides: Slide[] // Now contains full Slide objects for simplicity in mock
  difficulty: "beginner" | "intermediate" | "advanced" // Added difficulty
  duration: number // Added duration
  tags: string[] // Added tags
  createdAt: string
  updatedAt: string
}

export interface Course {
  _id: string
  courseTitle: string
  courseDescription: string
  courseLanguage: string
  slides: string[] // IDs of slides
  lessons: Lesson[]
  subType: "Free" | "Starter" | "Builder" | "Pro-Bundle" | "Organization" // Updated enum
  status: "Active" | "Draft" // Updated enum
  rating: number // Added rating
  language: string // Added language
  createdAt: string
  updatedAt: string
}

// Create mock data
export const mockCourses: Course[] = [
  {
    _id: "1",
    courseTitle: "HTML & CSS Fundamentals",
    courseDescription: "Learn the basics of web development with HTML and CSS",
    courseLanguage: "English",
    slides: [],
    lessons: [
      {
        _id: "l1",
        courseId: "1",
        title: "Introduction to HTML",
        description: "Learn the basics of HTML structure and elements",
        difficulty: "beginner",
        duration: 30,
        tags: ["HTML", "Web Development"],
        slides: [
          {
            _id: "s1",
            courseId: "1",
            lessonId: "l1",
            order: 1,
            title: "Welcome to HTML",
            content: `
              <div class="prose dark:prose-invert">
                <h2>Welcome to HTML Basics</h2>
                <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages.</p>
                <p>In this lesson, you'll learn:</p>
                <ul>
                  <li>Basic HTML structure</li>
                  <li>Common HTML elements</li>
                  <li>How to create your first webpage</li>
                </ul>
                <p>Let's get started by creating a simple HTML document!</p>
                <code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;My First Webpage&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Hello, World!&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;
                </code>
              </div>
            `,
            startingCode: `
<!DOCTYPE html>
<html>
  <head>
    <title>My First Webpage</title>
    <style>
      /* CSS will go here */
    </style>
  </head>
  <body>
    <!-- Try adding some HTML elements here -->
    
    <script>
      // JavaScript will go here
    </script>
  </body>
</html>
            `,
            imageUrls: ["/placeholder.svg?height=200&width=300"],
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
            titleFont: "Arial",
            themeColors: { main: "#000000", secondary: "#FFFFFF" },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: "s2",
            courseId: "1",
            lessonId: "l1",
            order: 2,
            title: "HTML Document Structure",
            content: `
              <div class="prose dark:prose-invert">
                <h2>HTML Document Structure</h2>
                <p>Every HTML document has a basic structure that includes the following elements:</p>
                <code>
&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;title&gt;Page Title&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;!-- Content goes here --&gt;
  &lt;/body&gt;
&lt;/html&gt;
                </code>
                <p>Try creating this structure in the editor!</p>
              </div>
            `,
            imageUrls: ["/placeholder.svg?height=250&width=400"],
            backgroundColor: "#F0F8FF",
            textColor: "#333333",
            titleFont: "Georgia",
            themeColors: { main: "#333333", secondary: "#F0F8FF" },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: "s3",
            courseId: "1",
            lessonId: "l1",
            order: 3,
            title: "HTML Elements",
            content: `
              <div class="prose dark:prose-invert">
                <h2>Common HTML Elements</h2>
                <p>HTML uses elements to define the structure and content of a webpage.</p>
                <p>Some common elements include:</p>
                <ul>
                  <li><code>&lt;h1&gt;</code> to <code>&lt;h6&gt;</code> - Headings</li>
                  <li><code>&lt;p&gt;</code> - Paragraphs</li>
                  <li><code>&lt;a&gt;</code> - Links</li>
                  <li><code>&lt;img&gt;</code> - Images</li>
                  <li><code>&lt;ul&gt;</code>, <code>&lt;ol&gt;</code>, <code>&lt;li&gt;</code> - Lists</li>
                </ul>
                <p>Try adding some of these elements to your page!</p>
                <img src="/placeholder.svg?height=150&width=250" alt="HTML Elements Example" />
                <img src="/placeholder.svg?height=100&width=180" alt="Another HTML Element" />
              </div>
            `,
            imageUrls: ["/placeholder.svg?height=150&width=250", "/placeholder.svg?height=100&width=180"],
            backgroundColor: "#E0FFFF",
            textColor: "#222222",
            titleFont: "Verdana",
            themeColors: { main: "#222222", secondary: "#E0FFFF" },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "l2",
        courseId: "1",
        title: "CSS Basics",
        description: "Learn how to style your HTML with CSS",
        difficulty: "beginner",
        duration: 45,
        tags: ["CSS", "Styling"],
        slides: [
          {
            _id: "s4",
            courseId: "1",
            lessonId: "l2",
            order: 1,
            title: "Introduction to CSS",
            content: `
              <div class="prose dark:prose-invert">
                <h2>Welcome to CSS Basics</h2>
                <p>CSS (Cascading Style Sheets) is used to style and layout web pages.</p>
                <p>With CSS, you can control:</p>
                <ul>
                  <li>Colors and backgrounds</li>
                  <li>Font styles and text formatting</li>
                  <li>Layout and positioning</li>
                  <li>Animations and transitions</li>
                </ul>
                <p>Let's start styling our HTML!</p>
                <code>
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
}
h1 {
  color: #336699;
}
                </code>
              </div>
            `,
            startingCode: `
<!DOCTYPE html>
<html>
  <head>
    <title>CSS Basics</title>
    <style>
      /* Add your CSS here */
      body {
        font-family: Arial, sans-serif;
      }
    </style>
  </head>
  <body>
    <h1>My Styled Page</h1>
    <p>This is a paragraph that we'll style with CSS.</p>
    <ul>
      <li>List item 1</li>
      <li>List item 2</li>
      <li>List item 3</li>
    </ul>
    
    <script>
      // JavaScript will go here
    </script>
  </body>
</html>
            `,
            imageUrls: ["/placeholder.svg?height=220&width=350"],
            backgroundColor: "#F8F8FF",
            textColor: "#111111",
            titleFont: "Roboto",
            themeColors: { main: "#111111", secondary: "#F8F8FF" },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            _id: "s5",
            courseId: "1",
            lessonId: "l2",
            order: 2,
            title: "CSS Selectors",
            content: `
              <div class="prose dark:prose-invert">
                <h2>CSS Selectors</h2>
                <p>CSS selectors are used to target HTML elements that you want to style.</p>
                <p>Common selectors include:</p>
                <ul>
                  <li><code>element</code> - Selects all elements of the specified type</li>
                  <li><code>.class</code> - Selects elements with the specified class</li>
                  <li><code>#id</code> - Selects the element with the specified ID</li>
                  <li><code>element.class</code> - Selects elements of a specific type with the specified class</li>
                </ul>
                <p>Try using different selectors in your CSS!</p>
                <code>
/* Element selector */
p {
  color: blue;
}

/* Class selector */
.my-class {
  font-weight: bold;
}

/* ID selector */
#my-id {
  text-decoration: underline;
}
                </code>
              </div>
            `,
            imageUrls: ["/placeholder.svg?height=180&width=300"],
            backgroundColor: "#F5FFFA",
            textColor: "#000000",
            titleFont: "Open Sans",
            themeColors: { main: "#000000", secondary: "#F5FFFA" },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "l3",
        courseId: "1",
        title: "JavaScript Basics",
        description: "Add interactivity to your web pages with JavaScript",
        difficulty: "beginner",
        duration: 60,
        tags: ["JavaScript", "Interactivity"],
        slides: [
          {
            _id: "s6",
            courseId: "1",
            lessonId: "l3",
            order: 1,
            title: "Introduction to JavaScript",
            content: `
              <div class="prose dark:prose-invert">
                <h2>Welcome to JavaScript Basics</h2>
                <p>JavaScript is a programming language that allows you to add interactivity to your web pages.</p>
                <p>With JavaScript, you can:</p>
                <ul>
                  <li>Respond to user actions</li>
                  <li>Modify HTML content dynamically</li>
                  <li>Validate form data</li>
                  <li>Create animations and effects</li>
                </ul>
                <p>Let's start coding with JavaScript!</p>
                <code>
document.getElementById('myButton').addEventListener('click', function() {
  alert('Button clicked!');
});
                </code>
              </div>
            `,
            startingCode: `
<!DOCTYPE html>
<html>
  <head>
    <title>JavaScript Basics</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        text-align: center;
        margin-top: 50px;
      }
      button {
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h1>JavaScript Demo</h1>
    <p id="demo">Click the button to change this text.</p>
    <button id="changeText">Click Me</button>
    
    <script>
      // Add your JavaScript code here
      
    </script>
  </body>
</html>
            `,
            imageUrls: ["/placeholder.svg?height=200&width=300"],
            backgroundColor: "#FFFACD",
            textColor: "#333333",
            titleFont: "Consolas",
            themeColors: { main: "#333333", secondary: "#FFFACD" },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    subType: "Free",
    status: "Active",
    rating: 4.5,
    language: "English",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "2",
    courseTitle: "JavaScript Fundamentals",
    courseDescription: "Master the basics of JavaScript programming",
    courseLanguage: "English",
    slides: [],
    lessons: [
      {
        _id: "l4",
        courseId: "2",
        title: "Variables and Data Types",
        description: "Learn about JavaScript variables and data types",
        difficulty: "intermediate",
        duration: 50,
        tags: ["JavaScript", "Variables", "Data Types"],
        slides: [
          {
            _id: "s7",
            courseId: "2",
            lessonId: "l4",
            order: 1,
            title: "JavaScript Variables",
            content: `
              <div class="prose dark:prose-invert">
                <h2>JavaScript Variables</h2>
                <p>Variables are containers for storing data values.</p>
                <p>In JavaScript, you can declare variables using:</p>
                <ul>
                  <li><code>var</code> - The traditional way (function scoped)</li>
                  <li><code>let</code> - Block-scoped variable that can be reassigned</li>
                  <li><code>const</code> - Block-scoped variable that cannot be reassigned</li>
                </ul>
                <p>Try declaring some variables in the editor!</p>
                <code>
let name = "Alice";
const age = 30;
var city = "New York";
console.log(name, age, city);
                </code>
              </div>
            `,
            startingCode: `
<!DOCTYPE html>
<html>
  <head>
    <title>JavaScript Variables</title>
    <style>
      body {
        font-family: monospace;
        padding: 20px;
      }
      .output {
        background-color: #f4f4f4;
        padding: 10px;
        border-radius: 5px;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <h1>JavaScript Variables</h1>
    <div class="output" id="output">Output will appear here</div>
    
    <script>
      // Declare your variables here
      
      // Display the results
      function displayOutput() {
        const output = document.getElementById('output');
        output.innerHTML = "Check the console for results!";
        
        // Add your code to display variables here
      }
      
      displayOutput();
    </script>
  </body>
</html>
            `,
            imageUrls: ["/placeholder.svg?height=200&width=300"],
            backgroundColor: "#F0FFFF",
            textColor: "#000000",
            titleFont: "Courier New",
            themeColors: { main: "#000000", secondary: "#F0FFFF" },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    subType: "Starter",
    status: "Active",
    rating: 4.8,
    language: "English",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
