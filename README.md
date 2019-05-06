This is the readme of creature ai full project

Rationale

Adaptive expertise is when problem-solvers are able to efficiently solve previously encountered tasks and generate new procedures for new tasks. In a world that is constantly transmuting helping children to became adaptive experts is extremely important, but extremely hard for two main reasons. The fist one is that adaptive experts need to apply what they know to new and previously encounter situations so teachers need to constantly create experiences that will allow that exploration to happen. This is hard because creating those experiences normally involves multidisciplinary knowledge and scaffolding real world situations into classroom activities. The second reason is that learning is hard and it requires many hours of being focused and engaged, for children to achieve that state they need to be doing something that is really interesting, and each children find different things interesting. 

Thanks to the 'Makers Movement' the web is full with DIY projects that employ cheap and relatively easy-to-use technology. And more and more schools are adopting some type of 'project-based-learning' that uses 'making' technology (3D printers, microcontrolers, etc). Still, after more than 10 years that the 'Makers Movement' became popular educational institution struggle to support their students, teachers and school in creating real world projects that apply knowledge in all the different subjects. 'Maker spaces' in school aren't integrated with the other subjects (math, physics, biology, etc) and teachers don't have the time and the proper training to scaffold and integrate the subject content with real world projects.

Machine Learning (ML) has been used mostly as a tracking optimization system in education (e.g. being employed to teach the long multiplication algorithm as earlier as possible measuring if children are using accurately and fast), not as an empowerment tool for students or as a agency supporter. CREATURE explore how can ML help the implementation of 'project based learning' in schools giving more agency to children and helping teachers picking up relevant classroom projects.
Project Overview

CREATURE is a model that matches projects with a particular learning topic, it's intended to be used by teachers who want their students to learn by doing projects or by students who are interested in exploring a particular topic. It uses transfer learning on BERT and was improved with Active Learning. The code is available here and more details about the process of making it can be found here. 

The most important part was to find the correct data: The Exploratorium and Instructables. And use it the train a model that can amplify the data structure in The Exploratorium that is relevant for learning to the data of Instructables. 

Data

Examples of some projects from Instructables.

As Andrej Karpathy recently wrote in his blog: A Recipe for Training Neural Networks, the first step in ML is to become one with the data, so let me describe the data use for CREATURE. Through several years I have been using websites that contain the data that I draw inspiration from to create projects in education and design professional development for teachers: The Exploratorium,  Make Magazine , Hackster  and Instructables are some of those websites.

All those websites have different types of data: with different formats, information, focus, categories, audience and besides The Exploratorium all those projects are made by users. The data are articles that explain how to make different types of projects, from internet of things (IoT), to cooking, arts-and-craft or robotics. The projects vary on time, expertise, materials, skills, tools and topics. At minimun all of the projects have pictures, a description of the project, a category and a list of steps to make the project. After getting some of the data (thanks Dale Dougherty) and scraping the rest, I ended up with ~323,000 articles: 
                              280,000     Instructables
                              16,000      Hackster   
                              4,000       Exploratorium
                              3,000       MakeMagazine    

Instructables Example
 
On top you can see an examples of a project from Instructables describing how to make an Electric Eel Knex Roller Coster. Some projects have long descriptions, some a list of tools and materials, they might or not have Step Titles. The articles on MakeMagazine and Hackster are very similar to Instructables. Even thought I did some experiments using the pictures, I ended up not using that data for predicting which projects match specific learning topics. I just used the text of each project.  
Exploratorium Data

The Exploratorium educational goal is that  "by creating inquiry-based experiences and tools  that spark wonder; offer hands-on experiences;  and encourage questions, explorations, and  individual discovery, we're transforming the way  that people learn. Learning this way empowers  people to figure things out for themselves—about  science, but also about any topic, claim, or idea."  They have an spectacular set of activities that  achieve this, their projects' goal are not  functionality but learning.   

This is an example of an activity that describes how to create a motor and explains what's the mechanism that makes it work. All the Exploratorium activities have a list of topics in hierarchical levels (e.g. Physics -> Electricity and Magnetism) that are explored in their activities. Most of the topics are STEM related. I'll be using their list of topics as a label as well as the different ways they use to provide information: explanations, instructions, descriptions and tools & materials. 