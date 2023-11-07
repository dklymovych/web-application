cmake_minimum_required(VERSION 3.25)

project(pathfinding LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

add_compile_options(-Wall -Wextra)

add_executable(
  pathfinding
  src/main.cpp
  src/matrix.cpp
  src/pathfinding.cpp
)
