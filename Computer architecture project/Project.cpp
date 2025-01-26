#include <iostream>

#include <string>

#include <cstring>

#include <unistd.h>

#include <sys/types.h>

#include <sys/wait.h>

#include <sys/shm.h>

#include <sys/ipc.h>

#include <ctype.h>

//Function to remove letters from the inputed string





int main() {

    int pipe_fd[1];
    pid_t Child_process_C0_pid, P1_pid;
    // Pid of parentprocess P1
    pid_t P0_pid = getpid();
    std::cout << "P0 (PID:" << P0_pid << "): Creation of the pipe." << std::endl;
    // Creation of pipe
    if (pipe(pipe_fd) == -1) {
        perror("Pipe creation failed");
        exit(EXIT_FAILURE);
    }
    //Task 1
    // Get the input string from the user
    char inputed_string[256];
    std::cout << "Enter the test string: ";
    std::cin.getline(inputed_string, sizeof(inputed_string));
    
    // Fork C0
    Child_process_C0_pid = fork();
    if (Child_process_C0_pid == 0) {
        // Child process C0
        // Get the PID of C0
        pid_t C0_pid = getpid();
        std::cout << "C0 (PID:" << C0_pid << "): Forked. Cleaning and creating shared memory" << std::endl;
        // Close the write end of the pipe
        close(pipe_fd[1]);
        // Read the test string from the pipe
        read(pipe_fd[0], inputed_string, sizeof(inputed_string));
        std::cout << "C0 (PID:" << C0_pid << "): Reciving data from the pipe" << std::endl;

        //TASK 2
        // Clean the test string (remove numbers and special characters)
        int len = strlen(inputed_string);
        for (int i = 0; i < len; i++) {
        if (!isalpha(inputed_string[i])) {
            for (int j = i; j < len; j++) {
              inputed_string[j] =inputed_string[j + 1];
            }
            len--;
            i--;
        }
    }
         std::cout << "C0 (PID:" << C0_pid << "): Creating shared memory" << std::endl;
        // Create a shared memory segment
        key_t key = ftok("shared_memory_key", 65); // You can choose any key value
        int shmid = shmget(key, sizeof(inputed_string), 0666 | IPC_CREAT);
        // Attaching shared memory segment
        char *shared_string = (char *)shmat(shmid, nullptr, 0);
        // Write the cleaned string into the shared memory
        std::cout << "C0 (PID:" << C0_pid << "): Writing data to the shared memory" << std::endl;
        strcpy(shared_string, inputed_string);

        

 	std::cout << "Contents of Shared Memory: " << shared_string << std::endl;
    
 	shmdt(shared_string);
        // Create Task-P1 as a child of C0
        P1_pid = fork();
        if (P1_pid == 0) {
            //Child process P1
            // Get the PID of P1
            pid_t p1_pid = getpid();
            std::cout << "P1 (PID:" << p1_pid << "): Finding missing alphabets." << std::endl;
            
            // TASK 3
            char missing[26] = {0};
            for (int i = 0; i < strlen(inputed_string); i++) {
                char c = tolower(inputed_string[i]);
                if (c >= 'a' && c <= 'z') {
                    missing[c - 'a'] = 1;
                }
            }
            // Print the result here
            std::cout << "P1 (PID:" << p1_pid << "): Result: ";
            for (int i = 0; i < 26; i++) {
                if (!missing[i]) {
                   std::cout << char('a' + i);
                }
            }
            std::cout << std::endl;
            std::cout << "P1 (PID:" << p1_pid << "): Terminating P1" << std::endl;
            //Terminating P1
            exit(0);

        } else if (P1_pid > 0) {
            // C0 waits for P1 to finish
            int status;
            waitpid(P1_pid, &status, 0);
        } else {
            perror("Fork for P1 failed");
            exit(EXIT_FAILURE);
        }
    //delete shared memory
	if (shmctl(shmid, IPC_RMID, nullptr) == -1) {
            perror("C0:Shared memory deletion failed");
        }
        // Terminate C0 after P1 finishes
        std::cout << "C0 (PID:" << C0_pid << "): Shared memory deleted. C0 is terminating..." << std::endl;
        exit(0);

    } else if (Child_process_C0_pid > 0) {

        // Parent process 0
        std::cout << "P0 (PID:" << P0_pid << "): Forked C0. Sending data" << std::endl;
        // Close the read end of the pipe
        close(pipe_fd[0]);
        // Send the test string to C0 using the pipe
        write(pipe_fd[1], inputed_string, sizeof(inputed_string));
        // Parent process P0 waits for C0 to finish
        wait(nullptr);
    } else {
        perror("Fork for C0 failed");
        exit(EXIT_FAILURE);
    }
	std::cout << "P0 (PID:" << P0_pid << "): Terminating P0" << std::endl;
    //terminating P0
    return 0;
}


