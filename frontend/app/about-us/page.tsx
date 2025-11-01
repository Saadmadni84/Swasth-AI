"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface Article {
  title: string
  description: string
  content: string
  url: string
  source: string
  publishedAt: string
}

export default function AboutUs() {
  const [articles, setArticles] = useState<Article[]>([])
  const [summary, setSummary] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Mock data for demonstration
    const mockArticles = [
      {
        title: "पोषक तत्वों का भंडार, स्वास्थ्य के लिए उत्तम",
        description:
          "मूंगफली का पोषण, स्वास्थ्य लाभ, एंटीऑक्सिडेंट, हृदय स्वास्थ्य, मस्तिष्क स्वास्थ्य, रक्त शर्करा, फाइबर, विटामिन, खनिज, स्वस्थ नाश्ता",
        content:
          "Meta AI द्वारा जनरेट की गई प्रस्तुति छवि\n● मूंगफली में प्रोटीन और फाइबर प्रचुर मात्रा में होते हैं, जो शरीर को ऊर्जा प्रदान करते हैं और भूख को कम करते हैं।",
        url: "https://www.kvartha.com/health/nilakkadala-poshakangal/cid16320742.htm",
        source: "केवारथा | KVARTHA.COM",
        publishedAt: "2025-03-05T05:43:54Z",
      },
      {
        title: "भारत में स्वाइन फ्लू का कहर! देश की राजधानी में मिले 3000 से ज्यादा मामले, जानें बचाव के आसान उपाय",
        description:
          "Swine Flu Cases In Delhi: स्वाइन फ्लू वायरस के मामले दिल्ली में काफी तेजी से बढ़ते जा रहे हैं। वहीं इसके मामले और भी बढ़ने की काफी संभावना बनती जा रही है। आइए जानते हैं क्या है ये वायरस और कैसे करें इससे बचाव?",
        content:
          "swine flu cases\nSwine Flu Cases: भारत में स्वाइन फ्लू के मामले काफी तेजी से बढ़ते जा रहे हैं। देश की राजधानी दिल्ली में इसके 3000 से ज्यादा मामले दर्ज किए जा चुके हैं।",
        url: "https://www.timesnowhindi.com/health/swine-flu-cases-in-delhi-reported-thousand-of-cases-in-swine-flu-know-prevention-tips-in-hindi-article-118724073",
        source: "Times Now Navbharat",
        publishedAt: "2025-03-05T04:32:07Z",
      },
      {
        title: "वेट ट्रेनिंग के लिए टिप्स,- Weight training ke liye tips",
        description:
          "एक्सरसाइज़ के दौरान सतर्कता न बरतने से अक्सर मांसपेशियों में खिंचाव की समस्या बनी रहती हैं। ऐसे में फिटनेस के स्तर और उम्र के आधार पर व्यायाम में अलग अलग बदलाव होने आवश्यक है।",
        content:
          "एक्सरसाइज़ के दौरान सतर्कता न बरतने से अक्सर मांसपेशियों में खिंचाव की समस्या बनी रहती हैं। ऐसे में फिटनेस के स्तर और उम्र के आधार पर व्यायाम में अलग अलग बदलाव होने आवश्यक है।",
        url: "https://www.healthshots.com/hindi/fitness/weight-training-things-to-remember-to-avoid-injuries/",
        source: "Healthshots Hindi",
        publishedAt: "2025-03-05T02:30:37Z",
      },
    ]

    const mockSummary = `स्वास्थ्य समाचार लेखों का सारांश (4-5 मार्च, 2025)

यह सारांश दिए गए समाचार लेखों से प्रमुख स्वास्थ्य रुझानों और चिकित्सा निहितार्थों को उजागर करता है।

I. संक्रामक रोगों का प्रकोप:

* टेक्सास में खसरा का प्रकोप: टेक्सास में खसरे का एक महत्वपूर्ण प्रकोप हो रहा है, जिसके कारण सीडीसी ने एक प्रतिक्रिया दल भेजा है।
* दिल्ली में स्वाइन फ्लू: दिल्ली में स्वाइन फ्लू के 3000 से अधिक मामले सामने आए हैं, जो संक्रमण में चिंताजनक वृद्धि का संकेत देते हैं।
* केरल में निपाह वायरस अलर्ट: फल चमगादड़ के संभोग के मौसम के कारण पांच केरल जिलों के अस्पताल निपाह वायरस के लिए अलर्ट पर हैं।`

    setArticles(mockArticles)
    setSummary(mockSummary)
    setIsLoading(false)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("hi-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center mb-12"
        >
          स्वास्थ्य समाचार अपडेट
        </motion.h1>

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-lg">समाचार लोड हो रहे हैं...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              पुनः प्रयास करें
            </Button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {articles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader className="p-3 sm:p-6">
                      <CardTitle className="text-base sm:text-lg md:text-xl">{article.title}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {formatDate(article.publishedAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow p-3 sm:p-6 pt-0 sm:pt-0">
                      <p className="mb-2 sm:mb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {article.description}
                      </p>
                      <p className="text-xs sm:text-sm line-clamp-3">{article.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center p-3 sm:p-6">
                      <span className="text-xs text-gray-500">{article.source}</span>
                      <Button asChild variant="outline" size="sm" className="h-8 text-xs sm:text-sm">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          पूरा पढ़ें <ExternalLink className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            {summary && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-12"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>समाचार सारांश</CardTitle>
                    <CardDescription>प्रमुख स्वास्थ्य रुझान और चिकित्सा निहितार्थ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line">{summary}</div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

