#include "pathfinding.hpp"

#include <vector>
#include <thread>

void task(Matrix& dist, Matrix& next, size_t start, size_t end) {
    auto [n, _] = dist.size();

    for (size_t k = start; k < end; ++k) {
        if (start == 0) {
            std::cout << ((k + 1) * 100) / end << std::endl;
        }

        for (size_t i = 0; i < n; ++i) {
            for (size_t j = 0; j < n; ++j) {
                int tmp = dist(i, k) + dist(k, j);

                if (dist(i, j) > tmp) {
                    dist(i, j) = tmp;
                    next(i, j) = next(i, k);
                }
            }
        }
    }
}

void floyd_algorithm(Matrix& dist, Matrix& next, int n_threads) {
    std::vector<std::thread> threads(n_threads);
    auto [n, _] = dist.size();

    size_t start = 0;
    size_t n_vertices = n / n_threads;
    size_t other = n % n_threads;

    for (int i = 0; i < n_threads; ++i) {
        size_t end = start + n_vertices;

        if (other != 0) {
            ++end;
            --other;
        }

        threads[i] = std::thread(
            task,
            std::ref(dist),
            std::ref(next),
            start,
            end
        );

        start = end;
    }

    for (auto& thr : threads) {
        thr.join();
    }
}
