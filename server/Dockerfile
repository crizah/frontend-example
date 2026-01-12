FROM golang:1.25.5 AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
COPY .env .
RUN go build -o server ./cmd/server/main.go

# FROM alpine:latest
# WORKDIR /app
# COPY --from=builder /app/server .

EXPOSE 8081
CMD ["./server"]
