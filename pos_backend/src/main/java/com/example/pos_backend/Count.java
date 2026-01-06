package com.example.pos_backend;

import java.util.Scanner;

public class Count {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("enter the string ");
        String name = sc.nextLine();
         boolean [] visted = new boolean[name.length()];

        for (int i = 0; i < name.length(); i++) {
            if (visted[i] ) {
                continue;
            }

            int count =1;
            for (int j = i+1; j < name.length(); j++) {
                if (name.charAt(i)== name.charAt(j)){
                    count++;
                    visted[j]=true;
                }

            }

            System.out.println(name.charAt(i)+" "+ count);

        }

    }
}
