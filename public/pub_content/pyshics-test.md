---
title: Simple physics simulation using Box2D and OpenGL
description: Box2D + SDL2 + GLUT + OpenGL
category: Games
recommended: true
---

This approach uses a very old openGL pipeline and outdated GLU library - not to be repeated!

This was part of my initial OpenGL research so I saw it fitting to be included!

My first approach produced this simple result!

<img src="/img/test.gif" alt="self portrait" width="500">

```C++
#include <iostream>
#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>
#include <GL/gl.h>
#include <GL/glu.h>
#include "./box2d/include/box2d/box2d.h"

const int WIDTH=640;
const int HEIGHT=480;
const float M2P=20;
const float P2M=1/M2P;
b2World* world;

b2Body* addRect(int x,int y,int w,int h,bool dyn=true)
{
   b2BodyDef bodydef;
   bodydef.position.Set(x*P2M,y*P2M);
   if(dyn)
      bodydef.type=b2_dynamicBody;
   b2Body* body=world->CreateBody(&bodydef);
	
   b2PolygonShape shape;
   shape.SetAsBox(P2M*w/2,P2M*h/2);
   
   b2FixtureDef fixturedef;
   fixturedef.shape=&shape;
   fixturedef.density=1.0;
   body->CreateFixture(&fixturedef);
}

void drawSquare(b2Vec2* points,b2Vec2 center,float angle)
{
	glColor3f(1,1,1);
	glPushMatrix();
		glTranslatef(center.x*M2P,center.y*M2P,0);
		glRotatef(angle*180.0/M_PI,0,0,1);
		glBegin(GL_QUADS);
			for(int i=0;i<4;i++)
				glVertex2f(points[i].x*M2P,points[i].y*M2P);
		glEnd();
	glPopMatrix();
}

void init()
{
	glMatrixMode(GL_PROJECTION);
		glOrtho(0,WIDTH,HEIGHT,0,-1,1);
	glMatrixMode(GL_MODELVIEW);
	glClearColor(0,0,0,1);
	world=new b2World(b2Vec2(0.0,9.81));
	addRect(WIDTH/2,HEIGHT-50,WIDTH,30,false);
}

void display()
{
   glClear(GL_COLOR_BUFFER_BIT);
   glLoadIdentity();
   b2Body* tmp=world->GetBodyList();
   b2Vec2 points[4];
   while(tmp)
   {
      for(int i=0;i<4;i++)
         points[i]=((b2PolygonShape*)tmp->GetFixtureList()->GetShape())->m_vertices[i];
      drawSquare(points,tmp->GetWorldCenter(),tmp->GetAngle());
      tmp=tmp->GetNext();
   }
}

int main(int argc,char** argv)
{
	SDL_Init(SDL_INIT_EVERYTHING);
	//SDL_SetVideoMode(640,480,32,SDL_OPENGL);
    SDL_Window *window = SDL_CreateWindow("My window",0,0,640,480,SDL_WINDOW_OPENGL);
    SDL_GLContext glcontext = SDL_GL_CreateContext(window);
	Uint32 start;
	SDL_Event event;
	bool running=true;
	init();
	while(running)
	{
		start=SDL_GetTicks();
		while(SDL_PollEvent(&event))
		{
			switch(event.type)
			{
				case SDL_QUIT:
					running=false;
					break;
				case SDL_KEYDOWN:
					switch(event.key.keysym.sym)
					{
						case SDLK_ESCAPE:
							running=false;
							break;
					}
					break;
				case SDL_MOUSEBUTTONDOWN:
					addRect(event.button.x,event.button.y,20,20,true);
					break;
			}
		}
		display();
		world->Step(1.0/30.0,8,3);	//update
        SDL_GL_SwapWindow(window);
		if(1000.0/30>SDL_GetTicks()-start)
			SDL_Delay(1000.0/30-(SDL_GetTicks()-start));
	}
	SDL_Quit();
}
```

# Making a general game engine

This initial project gave me the inspiration to produce a general engine which is flexible enough to use in mutiple projects!

\> **https://github.com/dmh1g19/Graphics-and-physics-library** 


# Using the example engine #1: Visual graph generator

The initial experiment above gave me some inspiration to make two simple projects, this time using a current/modern pipeline!

<img src="/img/test1.gif" alt="" width="500">

\> **https://github.com/dmh1g19/graph-library** 

This time I made a graph visualizing tool!


```C++
#include "physics.h"
#include "utilities.h"
#include "shapeFactory.h"
#include "graph.h"
#include <cmath> 

const int RADIUS = 4; 
const int SPACING = 50;
std::unordered_map<int, b2Body*> nodeBodyMap; 

void createSimpleGraph(int totalNodes) {
    Graph G = Graph(true);

    for (int i=0;i<totalNodes;i++) {
      G.addNode(i);
    }

    G.setEdge(1, 2);
    G.setEdge(2, 3);
    G.setEdge(3, 4);
    G.setEdge(4, 5);
    G.setEdge(6, 7);
    G.setEdge(8, 9);
    G.setEdge(10, 11);
    G.setEdge(12, 13);
    G.setEdge(13, 14);
    G.setEdge(14, 15);
    G.setEdge(15, 2);
    G.setEdge(16, 4);

    // Generate circles for each node
    const auto& graph = G.get_graph();
    int numNodes = graph.size();
    double angleIncrement = 2 * M_PI / numNodes;
    double angle = 0;

    for (const auto& pair : graph) {
      int nodeId = pair.first;

      // Calculate position using polar coordinates
      double x = WIDTH / 2 + SPACING * cos(angle);
      double y = HEIGHT / 2 + SPACING * sin(angle);

      b2Body* body = addCircle(x, y, RADIUS, true, 10);
      nodeBodyMap[nodeId] = body; 
      angle += angleIncrement;
    }

    // Add joints (edges) between nodes
    for (const auto& pair : graph) {
        int nodeId = pair.first;
        const auto& edges = pair.second->getEdges();

        for (int targetNodeId : edges) {
            if (nodeBodyMap.find(targetNodeId) != nodeBodyMap.end()) {
                //std::cout << "Edge formed between " << nodeId << " and " << targetNodeId << std::endl;
                addDistanceJoint(nodeBodyMap[nodeId], nodeBodyMap[targetNodeId]);
                addEdge(nodeBodyMap[nodeId], nodeBodyMap[targetNodeId]);
            }
        }
    }
}
```

# Using the example engine #2: Primitive objects physics game

After making a graphing tool I decided to make a more interactive video game!

<img src="/img/test2.gif" alt="" heght="500">

\> **https://github.com/dmh1g19/Merge-a-Mundo** 