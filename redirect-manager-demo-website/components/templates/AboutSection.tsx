import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';

export function AboutSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Heading level="h2" align="center" className="mb-6">
            About Redirect Manager
          </Heading>
          <Text size="lg" className="mx-auto max-w-3xl">
            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam,
            nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Heading level="h3" className="mb-4">
              Enterprise-Grade Solution
            </Heading>
            <Text className="mb-6">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
              totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </Text>
            <Text>
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
              magni dolores eos qui ratione voluptatem sequi nesciunt.
            </Text>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl">
            <Heading level="h3" className="mb-4">
              Key Benefits
            </Heading>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 shrink-0"></div>
                <Text>Lorem ipsum dolor sit amet consectetur adipiscing elit</Text>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 shrink-0"></div>
                <Text>Sed do eiusmod tempor incididunt ut labore et dolore</Text>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 shrink-0"></div>
                <Text>Ut enim ad minim veniam quis nostrud exercitation</Text>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 shrink-0"></div>
                <Text>Duis aute irure dolor in reprehenderit in voluptate</Text>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
