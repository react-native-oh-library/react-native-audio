cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

file(GLOB rnoh_audio_SRC CONFIGURE_DEPENDS *.cpp)
add_library(rnoh_audio SHARED ${rnoh_audio_SRC})
target_include_directories(rnoh_audio PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(rnoh_audio PUBLIC rnoh)
