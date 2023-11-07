#pragma once

#include <iostream>
#include <memory>

class Matrix {
private:
    std::unique_ptr<int[]> data_;
    size_t rows_, cols_;
public:
    Matrix(size_t rows, size_t cols);

    std::pair<size_t, size_t> size() const;

    void read(std::istream& is);
    void write(std::ostream& os) const;

    int& operator()(size_t i, size_t j);
    int operator()(size_t i, size_t j) const;
};
