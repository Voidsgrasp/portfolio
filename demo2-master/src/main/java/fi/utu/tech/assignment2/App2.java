package fi.utu.tech.assignment2;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.stream.Stream;

public class App2 {

    public static void main(String[] args) {
        List<Integer> sharedList = new ArrayList<>();
        // Luodaan ja käynnistetään threadCount verran laskijasäikeitä, jotka jokainen lisäävät addCount verran alkioita listaan
        int threadCount = 100;
        int addCount = 1000;
        CountDownLatch latch = new CountDownLatch(threadCount);
        List<ListEditor> counters = Stream.generate(() -> new ListEditor(sharedList, addCount,latch)).limit(threadCount).toList();
       
        counters.forEach(c -> c.start());
        counters.forEach(c -> {
            try {
                latch.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
         
        System.out.printf("Got %d, expected %d%n", sharedList.size(), threadCount*addCount);
    }
}


class ListEditor extends Thread {

    List<Integer> l;
    private final int count;
    private CountDownLatch latch;

    public ListEditor(List<Integer> l, int count,CountDownLatch latch) {
        this.l = l;
        this.count = count;
        this.latch = latch;
    }

    @Override
    public void run() {
        for (int i=0; i<count;i++) {
            synchronized (l) {
            l.add(123);
            }
        }
        latch.countDown();
    }
}