#include "matrix.hpp"

Matrix::Matrix(size_t rows, size_t cols) : rows_(rows), cols_(cols) {
    data_ = std::make_unique<int[]>(rows * cols);
}

std::pair<size_t, size_t> Matrix::size() const {
    return std::make_pair(rows_, cols_);
}

int& Matrix::operator()(size_t i, size_t j) {
    return data_[(cols_ * i) + j];
}

int Matrix::operator()(size_t i, size_t j) const {
    return data_[(cols_ * i) + j];
}

void Matrix::read(std::istream& is) {
    is.read(reinterpret_cast<char*>(data_.get()), sizeof(int) * rows_ * cols_);
}

void Matrix::write(std::ostream& os) const {
    os.write(reinterpret_cast<char*>(data_.get()), sizeof(int) * rows_ * cols_);
}
