import numpy as np
import matplotlib.pyplot as plt

x = np.arange(128)
y = np.ones_like(x)

plt.title("buffer")
plt.grid()
plt.xlim(0, 127)
plt.ylim(-1.05, +1.05)
plt.plot(x, y)
plt.show()
