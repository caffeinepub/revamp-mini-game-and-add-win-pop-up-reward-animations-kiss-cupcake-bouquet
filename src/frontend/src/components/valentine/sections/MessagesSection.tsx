import { useGetMessages } from '@/hooks/useMessages';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, Heart } from 'lucide-react';

export default function MessagesSection() {
  const { data: messages = [], isLoading } = useGetMessages();

  const sortedMessages = [...messages].sort((a, b) => Number(a.position) - Number(b.position));

  return (
    <section id="messages" className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Messages From My Heart
          </h2>
          <p className="text-lg text-muted-foreground">
            Words I want you to always remember
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sortedMessages.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Messages Yet</h3>
            <p className="text-muted-foreground">
              Messages will appear here once they're added
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {sortedMessages.map((message, index) => (
              <Card
                key={message.id}
                className="heart-shadow hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-8 relative">
                  <div className="absolute top-4 right-4">
                    <Heart className="w-6 h-6 text-primary/20 fill-primary/20" />
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
