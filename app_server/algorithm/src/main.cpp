#include "pathfinding.hpp"

#include <iostream>
#include <fstream>
#include <limits>
#include <unistd.h>

const int INF = std::numeric_limits<int>::max() / 2;

int main(int argc, char* argv[]) {
    int opt;
    int n_opts = 2;

    int n_threads;
    std::string output;

    while ((opt = getopt(argc, argv, "t:o:")) != -1) {
        switch (opt) {
        case 't':
            n_threads = std::stoi(optarg);
            --n_opts;
            break;
        case 'o':
            output = optarg;
            --n_opts;
            break;
        default:
            break;
        }
    }

    if (n_opts != 0 || argc < optind + 1)
        return 1;

    try {
        std::ifstream ifs(argv[optind], std::ios::binary);

        if (!ifs.is_open())
            return 1;

        int n;
        ifs.read(reinterpret_cast<char*>(&n), sizeof(int));

        Matrix dist(n, n);
        dist.read(ifs);

        Matrix next(n, n);

        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (dist(i, j) == 0 && i != j) {
                    dist(i, j) = INF;
                    next(i, j) = -1;
                } else {
                    next(i, j) = j;
                }
            }
        }

        floyd_algorithm(dist, next, n_threads);

        std::ofstream ofs(output, std::ios::binary);
        ofs.write(reinterpret_cast<char*>(&n), sizeof(int));

        dist.write(ofs);
        next.write(ofs);
    } catch (...) {
        return 1;
    }

    return 0;
}
