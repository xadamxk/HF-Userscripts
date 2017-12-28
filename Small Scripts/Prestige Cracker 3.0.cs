using System;

namespace Prestige
{
    class Program
    {
        static void Main(string[] args)
        {
            // Had 20, lowered to 4 when published
            int[] repArray = new int[] { -4819, 2915, 4625, 3056 };
            int[] postArray = new int[] { 17325, 18258, 83880, 10853 };
            int[] threadArray = new int[] { 228, 314, 932, 190 };
            int[] onlineArray = new int[] { 14747908, 27925192, 35034852, 23051968 };
            int[] awardsArray = new int[] { 2, 22, 30, 6 };
            int[] prestigeArray = new int[] { 290, 1286, 2968, 758 };

            // Rep (.5) 
            for (double a = 15; a < 20; a = a + .1)
            {
                // Posts (1)
                for (double b = 45; b < 55; b = b + .1)
                {
                    // Threads (.5)
                    for (double c = 5; c < 15; c = c + .1)
                    {
                        // Online (100)
                        for (var d = 85000; d < 136000; d = d + 1000)
                        {
                            // Awards (1)
                            for (double e = 15; e < 22; e = e + .1)
                            {
                                var isMatch = true;
                                double calcPrestige = 0;
                                double realPrestige = 0;
                                // Loop through data set
                                for (var i = 0; i < repArray.Length; i++)
                                {
                                    double math = (repArray[i] / a) + (postArray[i] / b) + (threadArray[i] / c) + (onlineArray[i] / d) + (awardsArray[i] * e);
                                    // Compare calculated prestige to real prestige
                                    if (Math.Floor(math) == prestigeArray[i])
                                    {
                                        // Change match bool
                                        calcPrestige = Math.Floor(math);
                                        realPrestige = prestigeArray[i];
                                        // Display partial values
                                        Console.WriteLine("Partial (" + calcPrestige + ":" + realPrestige + "): " + a + ":" + b + ":" + c + ":" + d + ":" + e);
                                    }
                                    else
                                    {
                                        // Exit Loop, Match not found
                                        isMatch = false;
                                        break;
                                    }
                                }
                                // End of loop, print result if isMatch
                                if (isMatch)
                                {
                                    // Record possible solution
                                    Console.WriteLine("Match (" + calcPrestige + ":" + realPrestige + "): " + a + ":" + b + ":" + c + ":" + d + ":" + e);
                                    Console.ReadKey();
                                }
                            }
                        }
                    }
                    //Console.Clear();
                    //Console.WriteLine("Post Interval Change: " + b);
                }
                Console.Clear();
                Console.WriteLine("Rep Interval Change: " + a);
            }
            Console.WriteLine("Done");
            Console.ReadKey();
        }
    }
}
